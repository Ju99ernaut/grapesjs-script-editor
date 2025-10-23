import { CommandOptions, Plugin } from 'grapesjs';

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
export declare const plugin: Plugin<PluginOptions>;

export {
	plugin as default,
};

export {};
