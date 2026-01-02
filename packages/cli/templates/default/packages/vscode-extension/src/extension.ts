import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Japavel DSL extension is active');

  // Register a command to validate the file
  let disposable = vscode.commands.registerCommand('japavel.validate', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId === 'japavel') {
      // In a real implementation, we would call the @japavel/core parser here.
      // For now, simple feedback.
      vscode.window.showInformationMessage('Japavel DSL file detected!');
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
