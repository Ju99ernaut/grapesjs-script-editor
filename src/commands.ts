import type { Plugin, Component } from "grapesjs";
import type { PluginOptions } from ".";
import { cmdId } from "./consts";
import { isArray, isString } from "remeda";

export const commands: Plugin<PluginOptions> = (editor, opts = {}) => {
  const cm = editor.Commands;
  const md = editor.Modal;
  const domc = editor.Components;
  const {
    modalTitle,
    codeViewOptions,
    commandAttachScript,
    toolbarIcon,
    onRun,
    onError,
    starter,
  } = opts;
  let scriptTypesSupport = opts.scriptTypesSupport;

  let content: HTMLElement | null = null;

  const appendToContent = (
    target: HTMLElement,
    content: HTMLElement | string | null
  ) => {
    if (content instanceof HTMLElement) {
      target.appendChild(content);
    } else if (content) {
      target.insertAdjacentHTML("beforeend", content);
    }
  };

  if (isString(scriptTypesSupport)) {
    scriptTypesSupport = scriptTypesSupport.split(",");
  }

  if (isArray(scriptTypesSupport)) {
    scriptTypesSupport = scriptTypesSupport.includes("*")
      ? domc.getTypes().map((c) => c.id)
      : scriptTypesSupport;
  }

  if (scriptTypesSupport) {
    scriptTypesSupport.forEach((type) => {
      const typeOpt = domc.getType(type)?.model;
      domc.addType(type, {
        model: {
          initToolbar() {
            typeOpt.prototype.initToolbar.apply(this, arguments);
            const tb = this.get("toolbar");
            const tbExists = tb?.some((item) => item.command === cmdId);

            if (!tbExists) {
              tb?.unshift({
                command: cmdId,
                label: toolbarIcon,
                ...opts.toolbarBtnCustomScript,
              });
              this.set("toolbar", tb);
            }
          },
        },
      });
    });
  }

  cm.add(cmdId, {
    codeViewer: null as any,
    run(editor) {
      const target = editor.getSelected();

      if (target) this.showCustomCode(target);
    },

    stop() {
      md.close();
    },

    showCustomCode(target: Component) {
      const title = modalTitle;
      if (!content) content = this.getContent();
      let code = target.getScriptString() || starter;
      md.open({
        title,
        content,
      })
        .getModel()
        .once("change:open", () => editor.stopCommand(String(this.id)));
      this.getCodeViewer().setContent(code);
    },

    getPreContent() {
      return "";
    },

    getPostContent() {
      return "";
    },

    getContent() {
      const content = document.createElement("div");
      const pfx = editor.getConfig("stylePrefix");
      content.className = `${pfx}attach-script`;
      appendToContent(content, this.getPreContent());
      const codeViewer = this.getCodeViewer();
      codeViewer.refresh();
      setTimeout(() => codeViewer.focus(), 0);
      content.appendChild(codeViewer.getElement());
      appendToContent(content, this.getPostContent());
      appendToContent(content, this.getContentActions());

      return content;
    },

    getContentActions() {
      const actions = document.createElement("div");
      actions.id = "actns";
      const btn = document.createElement("button");
      const pfx = editor.getConfig("stylePrefix");
      btn.innerHTML = opts.buttonLabel || "Save";
      btn.className = `${pfx}btn-prim ${pfx}btn-save__inject-logic`;
      btn.onclick = () => this.handleSave();

      const runLogic = document.createElement("div");
      runLogic.id = "logic-toolbar";
      runLogic.className = "fa fa-bug";
      runLogic.style =
        "margin:5px;padding:10px;background:rgba(0,0,0,0.2);border-radius:3px;border:1px solid rgba(0,0,0,0.2);cursor:pointer";
      runLogic.onclick = () => this.runCode();

      actions.appendChild(runLogic);
      actions.appendChild(btn);

      return actions;
    },

    /**
     * Handle the main save task
     */
    handleSave() {
      const code = this.getCodeViewer().getContent();
      editor.getSelected()?.set("script", code);
      editor.Modal.close();
    },

    getCodeViewer() {
      if (!this.codeViewer) {
        this.codeViewer = editor.CodeManager.createViewer({
          codeName: "javascript",
          theme: "hopscotch",
          readOnly: 0,
          autoBeautify: 1,
          ...codeViewOptions,
        });
      }

      return this.codeViewer;
    },

    /**
     * Evaluate code syntax
     */
    runCode() {
      try {
        const code = this.getCodeViewer().getContent();
        Function('"use strict";' + code)();
        onRun && onRun();
      } catch (err) {
        console.log("error", err);
        onError && onError(err);
      }
    },

    ...commandAttachScript,
  });
};
