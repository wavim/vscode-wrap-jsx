import { commands, ExtensionContext, Selection, TextEditor } from "vscode";

export function activate(context: ExtensionContext): void {
	context.subscriptions.push(
		commands.registerTextEditorCommand("wrap-jsx.wrap", wrap),
	);
}

export function deactivate(): void {}

async function wrap(editor: TextEditor): Promise<void> {
	const selection = editor.selection;

	const cursors: Selection[] = [];

	const apply = await editor.edit((edit) => {
		edit.insert(selection.start, "<>");
		edit.insert(selection.end, "</>");

		const insertOpenPos = selection.start.translate(0, 1);
		const insertClosePos = selection.end.translate(0, 2);

		const openCursor = new Selection(insertOpenPos, insertOpenPos);
		const closeCursor = new Selection(insertClosePos, insertClosePos);

		cursors.push(openCursor, closeCursor);
	});

	if (!apply) return;

	editor.selections = cursors;

	const isHtml = editor.document.languageId === "html";
	if (!isHtml) {
		await commands.executeCommand("editor.action.formatDocument");
	}
}
