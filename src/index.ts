import type { Plugin, CommandOptions } from "grapesjs";
import { commands } from "./commands";

export type PluginOptions = {
  /** Starter code shown in the code editor */
  starter?: string;

  /** HTML for the toolbar icon */
  toolbarIcon?: string;

  /** Component types allowed for script editing */
  scriptTypesSupport?: string | string[];

  /**
   * Extends the default toolbar button config for code editing.
   * Pass falsy to disable.
   */
  toolbarBtnCustomScript?: Record<string, any> | false;
  onRun?: () => void;
  onError?: (err: unknown) => void;
  modalTitle?: string;

  /** Label shown for the code editor area */
  codeLabel?: string;

  /** Options passed to the code viewer (e.g., theme, readonly, etc.) */
  codeViewOptions?: Record<string, any>;

  /** Label for the save button */
  buttonLabel?: string;

  /** Extend the inject logic command */
  commandAttachScript?: CommandOptions;
};

export const plugin: Plugin<PluginOptions> = (editor, opts = {}) => {
  const options: PluginOptions = {
    starter: "let el = this",
    toolbarIcon: '<i class="fa fa-file-code-o"></i>',
    scriptTypesSupport: [
      "default",
      "wrapper",
      "text",
      "textnode",
      "image",
      "video",
      "svg",
    ],
    toolbarBtnCustomScript: {},
    onRun: () => console.log("valid syntax"),
    onError: (err) => console.log("error", err),
    modalTitle: "Script",
    codeLabel: "JS",
    codeViewOptions: {},
    commandAttachScript: {},
    ...opts,
  };

  commands(editor, options);
};

export default plugin;
