import { EditorView, ViewUpdate, DecorationSet, Decoration, ViewPlugin} from '@codemirror/view'
import VimrcPlugin from "main"

// cm6 view plugin
export function updateEditor(plugin: VimrcPlugin) {
	return ViewPlugin.fromClass(
		class UpdatePlugin {
			decorations: DecorationSet;
			plugin: VimrcPlugin;
            selection: any[];

			constructor(public view: EditorView) {
				this.decorations = Decoration.none;
				this.plugin = plugin;
                this.selection = [];
                this.updateEditor();

				const { cm } = this.view;
				const { cursorActivity } = (cm as any)._handlers;
				if (cursorActivity.some(
					(e: { name: string }) => e.name === "updateSelection")
				)return;
				cm.on("cursorActivity", async (cm: CodeMirror.Editor) => this.selection = cm.listSelections())

                if (this.plugin.done) return;
                this.plugin.readVimInit(this.plugin.vimrcContent)
			}

			update(update: ViewUpdate) {
				// only focusChanged doesn't work
				// maybe focus lost is fired after the new focus is acquired, so alwayx the old editor stays in focus
				if (update.selectionSet) {
					this.updateEditor();
				}

			}

			updateEditor() {
                this.plugin.editor = this.view;
			}
		},
		{
			decorations: (v: any) => v.decorations,
		}
	);
}
