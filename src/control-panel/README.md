# Sketch Control Panel

- [ ] set of UI input controllers for different value types
	- [ ] free text
	- [ ] option selection
	- [ ] numeric
		- [ ] free text entry
		- [ ] incrementing (+/- incremental buttons)
		- [ ] slider
			- [ ] min, max, step size
			- [ ] interval (high and low selections)
			- [ ] multiple items on slider, options for maintaining order
	- [ ] color
		- [ ] single
		- [ ] palette
		- [ ] gradient
- [ ] parameter definition
	- [ ] data type
		- this should indicate which ui component to use
		- it will also define which optional properties are used in the parameter definition, ex. for number it can allow or block free text entry, incrementing buttons, step size of slider, etc.
	- [ ] optional configurations
	- [ ] default value
	- [ ] display information
		- [ ] label
		- [ ] description
- [ ] Context
	- [ ] input is a data structure which includes the definition of all of the paremeters that it will control, including display structure
- [ ] Control Panel
	- react component that will render controls for the paremeters defined in context
	- [ ] The control panel will render all the ui components for the paremeters provided by context
	- [ ] changes made on the control panel will update the parameter current values in context
	- [ ] Needs hooks for updating/controlling parameters and modifying the controller state
		- example of this are the image seeds which need to be randomly generated and controlled by keyboard inputs, but can be manually set by the user through the controller as well


## Control Panel Data Model

- use arrays for ordered elements
- use objects for elements
- elements are:
	- sections, collapsible
	- headers
	- info display
		- description information
		- potentially embedded react components for custom displays
	- parameter definitions
		- get displayed with controls

Example:

```ts
const rngControls: ControlPanelSection = {
	title: "RNG Controls",
	description: "Image and color seeds",
	elements: [
		{
			dataType: "string",
			key: "Pattern Seed",
			label: "imageSeed",
			minLength: 1
		},
		{
			dataType: "string",
			key: "Color Seed",
			label: "imageSeed",
			minLength: 1
		}
	]
}
const sketchParameters: ControlPanelSection = {
	title: "Sketch Config",
	description: "Custom parameters for this sketch",
	elements: [{
		dataType: "number",
		label: "count",
		description: "Number of elements to render",
		default: 20,
		min: 0,
		max: 100
	}]
};
const parameters: ControlPanelStructure = {
	title: "",
	 description: "",
	elements: [
		{},
		firstSection,
		secondSection]
}
```