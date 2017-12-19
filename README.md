PL Modal
========
Modal created with Javascript and CSS Transitions. Customizable by user and easy to implement.

### Usage
```javascript
let settings = {
	avoidClose: false,
	closeWithOverlay: true,
	effectName: 'pl-effect-4'
};

let modal = new pl.Modal(settings);
let element = document.getElementById('element');

modal.open(element);
```

Use `settings` to personalize the modal instance.

<table>
    <tr>
        <th>Value</th>
        <th>Type</th>
        <th>Default Value</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>avoidClose</td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>If avoidClose is true the modal can't be closed.</td>
    </tr>
    <tr>
        <td>closeWithOverlay</td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Allows close the modal by clicking the overlay.</td>
    </tr>
    <tr>
        <td>effectName</td>
        <td><code>string</code></td>
        <td>(empty)</td>
        <td>Allows the user select a predeterminated effect to open the modal.</td>
    </tr>
</table>

A modal instance has two events to notify when it was opened and closed and can be called as follows:

```javascript
// Notify when modal is opened.
modal.opened.add(() => { /* ... */ });

// Notify when modal is closed.
modal.closed.add(() => { /* ... */ });
```

### Static Methods
<table>
    <tr>
        <th>Name</th>
        <th>Return value</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><code>transitionSelect()</code></td>
        <td><code>string</code></td>
        <td>Get the name of <code>transitioned</code> supported by used browser.</td>
    </tr>
    <tr>
        <td><code>extendsDefaults(source: object, settings: object)</code></td>
        <td><code>object</code></td>
        <td>Mix two objects.</td>
    </tr>
</table>

### Events
<table>
    <tr>
        <th>Name</th>
        <th>Return value</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><code>closed</code></td>
        <td><code>pl.Event</code></td>
        <td>Get closed event.</td>
    </tr>
    <tr>
        <td><code>opened</code></td>
        <td><code>pl.Event</code></td>
        <td>Get opened event.</td>
    </tr>
</table>

### Methods
<table>
    <tr>
        <th>Name</th>
        <th>Return value</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><code>close()</code></td>
        <td><code>void</code></td>
        <td>Close modal.</td>
    </tr>
    <tr>
        <td><code>changeEffect(effectName: string)</code></td>
        <td><code>void</code></td>
        <td>Change current modal effect.</td>
    </tr>
    <tr>
        <td><code>open(element: HTMLElement|string)</code></td>
        <td><code>void</code></td>
        <td>Open modal with passed element.</td>
    </tr>
    <tr>
        <td><code>setContent(element: HTMLElement|string)</code></td>
        <td><code>void</code></td>
        <td>Change modal content with passed element.</td>
    </tr>
</table>

### Browser Support
