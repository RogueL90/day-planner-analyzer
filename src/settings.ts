import { App, PluginSettingTab, Setting } from "obsidian";
import type HelloWorldPlugin from "./main";

/** Persisted chat messages for the productivity assistant */
export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  ts: number;
};

export const LLM_MODEL_IDS = [
  "gpt-oss-20b",
  "codestral-latest",
  "GLM-4.6V-Flash",
] as const;

export interface DSASettings {
  chatHistory: ChatMessage[];
  chatModel: string;
}

export const DEFAULT_SETTINGS: DSASettings = {
  chatHistory: [],
  chatModel: "gpt-oss-20b",
};

export class DSASettingTab extends PluginSettingTab {
  plugin: HelloWorldPlugin;

  constructor(app: App, plugin: HelloWorldPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl).setHeading().setName("Day planner analyzer");

    new Setting(containerEl)
      .setName("Chat model")
      .setDesc(
        "Choose which model the productivity assistant uses. Powered by llm7.io; no API key required.",
      )
      .addDropdown((dropdown) => {
        for (const id of LLM_MODEL_IDS) {
          dropdown.addOption(id, id);
        }
        dropdown.setValue(this.plugin.settings.chatModel).onChange(async (value) => {
          this.plugin.settings.chatModel = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Clear assistant chat history")
      .setDesc("Remove all saved messages from the productivity assistant.")
      .addButton((btn) =>
        btn.setButtonText("Clear chat").onClick(async () => {
          this.plugin.settings.chatHistory = [];
          await this.plugin.saveSettings();
        }),
      );
  }
}
