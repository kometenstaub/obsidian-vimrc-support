import { EditorView } from '@codemirror/view'
import { StateField, EditorState,Transaction} from '@codemirror/state'
import VimrcPlugin from "main"
import {Editor, editorEditorField, editorInfoField} from 'obsidian'

//we never dispatch anything, so we don't even need a StateEffect
//const init = StateEffect.define<boolean>();

export function vimInitializer(plugin: VimrcPlugin): StateField<boolean>{
    return StateField.define<boolean>({
        create(state: EditorState): boolean {
            //@ts-ignore
            const editor: Editor = state.field(editorInfoField).editor
            plugin.readVimInit(plugin.vimrcContent, editor)
            return true;
        },
        //needed, but we never update anything
        update(oldState: boolean, transaction: Transaction): boolean {
            return true;
        }
    })
}


