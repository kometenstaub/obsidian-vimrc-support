import { EditorView, ViewUpdate, DecorationSet, Decoration, ViewPlugin} from '@codemirror/view'
import { StateEffect, StateField, EditorState,Transaction} from '@codemirror/state'
import VimrcPlugin from "main"
import {Editor, editorInfoField} from 'obsidian'

// const init = StateEffect.define<boolean>();
//
// export function vimInitializer(plugin: VimrcPlugin): StateField<boolean>{
//     return StateField.define<boolean>({
//         create(state: EditorState): boolean {
//             //@ts-ignore
//             const editor: Editor = state.field(editorInfoField).editor
//             return true;
//         },
//         //needed, but we never update anything
//         update(oldState: boolean, transaction: Transaction): boolean {
//             return transaction.state);
//         }
//     })
// }

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
				if (update.selectionSet && update.focusChanged) this.updateEditor();

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
