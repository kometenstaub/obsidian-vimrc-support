import { EditorView, ViewUpdate, DecorationSet, Decoration, ViewPlugin} from '@codemirror/view'
import { StateField, EditorState,Transaction} from '@codemirror/state'
import VimrcPlugin from "main"
import {Editor, editorInfoField} from 'obsidian'

//we never dispatch anything, so we don't even need a StateEffect
//const init = StateEffect.define<boolean>();

// export function vimInitializer(plugin: VimrcPlugin): StateField<boolean>{
//     return StateField.define<boolean>({
//         create(state: EditorState): boolean {
//             //@ts-ignore
//             const editor: Editor = state.field(editorInfoField).editor
//             plugin.readBasicVimInit(plugin.vimrcContent, editor)
//             return true;
//         },
//         //needed, but we never update anything
//         update(oldState: boolean, transaction: Transaction): boolean {
//             return true;
//         }
//     })
// }

// cm6 view plugin
export function updateEditor(plugin: VimrcPlugin) {
	return ViewPlugin.fromClass(
		class UpdatePlugin {
			decorations: DecorationSet;
			plugin: VimrcPlugin;

			constructor(public view: EditorView) {
				this.decorations = Decoration.none;
				this.plugin = plugin;
                this.updateEditor();
                this.plugin.readVimInit(this.plugin.vimrcContent)
			}
			update(update: ViewUpdate) {
				if (update.selectionSet) {
					this.updateEditor();
                }

			}

			updateEditor() {
                //@ts-ignore
				const { editor } = this.view.state.field(editorInfoField);
                this.plugin.editor = editor;
			}
		},
		{
			decorations: (v: any) => v.decorations,
		}
	);
}
