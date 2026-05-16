/**
 * Pi Logo Header Extension
 *
 * Replaces the built-in header with the Pi logo on the startup screen.
 */

import type { ExtensionAPI, Theme } from "@earendil-works/pi-coding-agent";
import { VERSION } from "@earendil-works/pi-coding-agent";

// --- PI LOGO ASCII ART ---
// Simplified Pi logo using ASCII art
function getPiLogo(theme: Theme): string[] {
	const piBlue = (text: string) => theme.fg("accent", text);
	const white = (text: string) => theme.fg("text", text);
	const dim = (text: string) => theme.fg("dim", text);
	
	// Create a simple Pi logo using ASCII characters
	const logo = [
		"      ██╗",
		"      ██╗",
		" █████╗██╗██╗",
		"██╔══╝██║██║",
		"███████║██║",
		"╚══════╝╚═╝",
	];
	
	return logo.map(line => piBlue(line));
}

export default function (pi: ExtensionAPI) {
	// Set custom header immediately on load (if UI is available)
	pi.on("session_start", async (_event, ctx) => {
		if (ctx.hasUI) {
			ctx.ui.setHeader((_tui, theme) => {
				return {
					render(_width: number): string[] {
						const logoLines = getPiLogo(theme);
						// Add subtitle with Pi branding
						const subtitle = `${dim("pi coding agent")} ${dim(`v${VERSION}`)}`;
						return [...logoLines, "", subtitle];
					},
					invalidate() {},
				};
			});
		}
	});

	// Command to restore built-in header
	pi.registerCommand("builtin-header", {
		description: "Restore built-in header with keybinding hints",
		handler: async (_args, ctx) => {
			ctx.ui.setHeader(undefined);
			ctx.ui.notify("Built-in header restored", "info");
		},
	});
}