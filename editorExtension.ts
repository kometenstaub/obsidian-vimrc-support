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
                if (this.plugin.done) return;
                this.plugin.readVimInit(this.plugin.vimrcContent)
			}
			update(update: ViewUpdate) {
                if (update.selectionSet) {
					this.updateEditor();
                    const sel = this.view.cm.listSelections()
                    if (sel.length === 1 && (sel[0].anchor.line !== sel[0].head.line || sel[0].anchor.ch !== sel[0].head.ch)) {
                        this.selection = sel;
                    }

                }
                else if (update.focusChanged) {
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
