# PlantUML Upgrade Guide

The PlantUML VS Code extension (jebbs) often bundles an older PlantUML version (e.g. 1.2021.00). To use a newer PlantUML and fix errors like **"Use 'allowmixing'..."** or **"This version of PlantUML is ... days old"**:

## 1. Diagram fix (already applied)

- Add `!pragma allowmixing` when mixing `object` and `rectangle` in the same diagram.
- Use `object "1" as Process1 { ... }` (quoted name + `as` alias) so arrows can reference it.

## 2. Use a newer PlantUML via server (recommended)

**.vscode/settings.json** is configured to use the public PlantUML server:

```json
{
  "plantuml.render": "PlantUMLServer",
  "plantuml.server": "https://www.plantuml.com/plantuml"
}
```

1. Install the [PlantUML extension](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml) if needed.
2. Reload VS Code / Cursor.
3. Open a `.puml` file and use **PlantUML: Preview Current Diagram** (or the preview pane).

The public server runs a recent PlantUML version. If you get timeouts or CORS issues, use the local option below.

## 3. Run a local PlantUML server (optional)

For full control and POST support:

1. Install [Java](https://adoptium.net/).
2. Download the latest **plantuml.jar**: https://plantuml.com/download.
3. Run the PicoWeb server:
   ```bash
   java -jar plantuml.jar -picoweb:8080
   ```
4. In **.vscode/settings.json**, set:
   ```json
   {
     "plantuml.render": "PlantUMLServer",
     "plantuml.server": "http://localhost:8080/"
   }
   ```
5. Reload the editor and preview again.

## References

- [PlantUML changes](https://plantuml.com/changes)
- [PlantUML PicoWeb](https://plantuml.com/picoweb)
- [jebbs PlantUML extension](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml)
