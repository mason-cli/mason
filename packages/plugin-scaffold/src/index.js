import { Command } from "@mason-cli/core";
import fs from "fs";
import path from "path";
import { get } from "lodash";

class ScaffoldUtil {
  static registerConfigTemplates(command) {
    let templates = command.runner.data.get("scaffold.templates");
    let conf = command.conf.scaffold || {};

    // Register config templates on top of any plugin templates
    if (conf.hasOwnProperty("templates") && typeof conf.templates == "object") {
      let conf_templates = new Map(Object.entries(conf.templates));
      conf_templates.forEach((location, name) => {
        templates.set(name, location);
      });
    }
  }

  static getConf() {}
}

class MasonScaffoldCommand extends Command {
  conf = {};
  runner = false;
  input = false;

  constructor(runner) {
    super();
    this.runner = runner;
  }

  /**
     * Read & replace template buffer
     * @param  {string} template Template Name
     * @return {string}          Replaced template buffer
     */
  async prepareTemplate(template) {
    let templates = this.runner.data.get("scaffold.templates");
    if (!templates.has(template)) {
      throw "Invalid template requested: " + template;
    }

    let templateValue = templates.get(template);
    let filename;
    if (typeof templateValue == "object") {
      filename = templateValue.source;
    } else {
      filename = templateValue;
    }
    if (!fs.existsSync(filename)) {
      throw "Invalid template path '" + filename + "' for '" + template + "'";
    }

    let conf = this.conf.hasOwnProperty("scaffold") ? this.conf.scaffold : {};

    let var_prefix = conf.hasOwnProperty("var_prefix")
      ? conf.var_prefix
      : "@@{";
    let var_suffix = conf.hasOwnProperty("var_suffix")
      ? conf.var_suffix
      : "}@@";

    let buffer = fs.readFileSync(filename) + "";

    let interactive =
      this.input.flags.indexOf("interactive") !== -1 ||
      this.input.flags.indexOf("i") !== -1;

    console.log("Interactive", interactive);
    let defaultValues = conf.definitions ? conf.definitions : {};
    let replacements = new Map(Object.entries(defaultValues));
    if (interactive) {
      let prefix_match = (var_prefix + "")
        .replace(/[\\"']/g, "\\$&")
        .replace(/\u0000/g, "\\0");
      let suffix_match = (var_suffix + "")
        .replace(/[\\"']/g, "\\$&")
        .replace(/\u0000/g, "\\0");
      let match_txt = new RegExp(prefix_match + "([^ ]+)" + suffix_match, "g");
      let parts = buffer.match(match_txt);
      let self = this;
      console.log(
        "When prompted, please provide a replacement for the following variables:"
      );
      parts.forEach(part => {
        let variable = (part + "")
          .replace(var_prefix, "")
          .replace(var_suffix, "");
        let defaultValue = replacements.has(variable)
          ? replacements.get(variable)
          : "";
        let value = self.runner.prompt(
          " > " + variable + '    (default: "' + defaultValue + '"):' + "\t"
        );
        replacements.set(variable, value ? value : defaultValue);
      });
    } else {
      if (this.input.options) {
        try {
          this.input.options.forEach((word, replacement) => {
            replacements.set(word, replacement);
          });
        } catch (e) {
          for (let varName in this.input.options) {
            if (this.input.options.hasOwnProperty(varName)) {
              replacements.set(varName, this.input.options[varName]);
            }
          }
        }
      }
    }
    replacements.forEach((replacement, original) => {
      console.info(
        ` - Replacing ${var_prefix}${original}${var_suffix} with ${replacement}`
      );
      buffer = buffer.replace(
        `${var_prefix}${original}${var_suffix}`,
        replacement
      );
    });

    return buffer;
  }

  /**
     * Execute the scaffold command
     * @param  {object} input       The Mason input object
     * @param  {object} config      The Mason config object
     * @return {void}
     */
  async run(input, conf) {
    this.conf = conf;
    this.input = input;
    if (input.args.length) {
      // Register configuration templates
      ScaffoldUtil.registerConfigTemplates(this);

      let template = input.args[0];
      let destination = input.args[1];
      if (!template || !destination) {
        throw "Usage: mason scaffold [template] [destination] [--var=val]";
      }

      let templates = this.runner.data.get("scaffold.templates");
      if (templates.has(template)) {
        let flags =
          input.flags.indexOf("f") !== -1 || input.flags.indexOf("force") !== -1
            ? "w+"
            : "wx";
        let withTemplate = async (fd, template) => {
          // We have a valid write stream, parse the template
          let buffer = await this.prepareTemplate(template);
          await fs.write(fd, buffer, (err, written, buffer) => {
            if (err) {
              throw err;
            } else {
              console.log(`Template ${template} written to ${destination}`);
            }
          });
        };

        let templateObj = templates.get(template);
        let conf = this.conf.scaffold || {};
        let destination_prefix;
        if (typeof templateObj == "object") {
          if (typeof templateObj.destination !== "undefined") {
            destination_prefix = templateObj.destination;
          }
        }

        if (destination.substr(0, 1) == "/") {
          // Hold out
        } else {
          if (destination_prefix) {
            destination = destination_prefix + path.sep + destination;
          } else if (conf.destination_path) {
            destination = conf.destination_path + path.sep + destination;
          }
        }

        // Attempt to open a write stream to the destination
        let fd;
        try {
          fd = fs.openSync(destination, flags);
        } catch (e) {
          throw `The file at ${destination} already exists or is not readable.`;
        }

        return await withTemplate(fd, template);
      } else {
        console.log("Invalid template requested: " + template);
      }
    } else {
      console.log("What do you want to scaffold?");
    }
  }
}

class MasonScaffoldLSCommand extends Command {
  run(resolve, reject) {
    ScaffoldUtil.registerConfigTemplates(this);

    console.log("Mason Templates");
    console.log("---------------------------");
    let templates = this.runner.data.get("scaffold.templates");
    templates.forEach((location, name) => {
      console.info(" + " + name + ": " + location);
    });
    console.log("---------------------------");
  }
}

/**
 * Plugin bootstrap method
 * @param  {Mason} Mason The Mason CLI instance
 * @return {void}
 */
export default Mason => {
  // Register the scaffold command with Mason
  Mason.registerCommand("scaffold", MasonScaffoldCommand);
  Mason.registerCommand("scaffold-ls", MasonScaffoldLSCommand);

  // Create a template store
  Mason.data.set("scaffold.templates", new Map());

  // Allow registration of scaffold templates from other plugins
  Mason.on("addScaffoldTemplate", opt => {
    if (opt.hasOwnProperty("name") && opt.hasOwnProperty("location")) {
      console.log(`> Scaffold \t Template registered: ${opt.name}`);
      Mason.data.get("scaffold.templates").set(opt.name, opt.location);
    } else {
      console.error(
        "Unable to register scaffold template. Invalid name or location.",
        opt
      );
    }
  });
};
