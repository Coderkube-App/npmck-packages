# Form Ready

Universal form validation and handling for React, Next.js, Vite, and vanilla JavaScript.

## Installation

```bash
npm install form-ready zod
```

## Features

- **Universal** — Works with React, Next.js, Vite, and vanilla JS
- **TypeScript** — Full type safety with Zod schemas
- **Lightweight** — Zero runtime dependencies
- **Accessible** — ARIA support built-in

## Usage

### React

```tsx
import { useForm } from 'form-ready/react';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old')
});

function MyForm() {
  const { values, handleChange, handleBlur, handleSubmit, isValid, errors } = useForm({
    schema,
    initialValues: { name: '', email: '', age: 0 },
    onSubmit: (data) => console.log('Submitted:', data)
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-field="name"
        value={values.name.value}
        onChange={handleChange('name')}
        onBlur={handleBlur('name')}
      />
      {values.name.error && <span data-error>{values.name.error}</span>}

      <input
        data-field="email"
        value={values.email.value}
        onChange={handleChange('email')}
        onBlur={handleBlur('email')}
      />
      {values.email.error && <span data-error>{values.email.error}</span>}

      <button type="submit" disabled={!isValid}>Submit</button>
    </form>
  );
}
```

### Vanilla JS

```html
<form id="myForm">
  <input type="text" data-field="name" />
  <span data-error></span>

  <input type="email" data-field="email" />
  <span data-error></span>

  <button type="submit">Submit</button>
</form>
```

```javascript
import { initForm } from 'form-ready/vanilla';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email()
});

const form = document.getElementById('myForm');

initForm(form, {
  schema,
  onValid: (data) => console.log('Valid:', data),
  onInvalid: (errors) => console.log('Errors:', errors)
});
```

## API

### Core (`form-ready`)

| Function | Description |
|----------|-------------|
| `validate(data, schema)` | Validate data against Zod schema |
| `validateField(name, value, schema)` | Validate single field |
| `createFormState(values)` | Initialize form state |
| `setFieldValue(state, field, value, schema)` | Update field value |
| `getValues(state)` | Extract all values |
| `hasErrors(state)` | Check for errors |

### React (`form-ready/react`)

| Hook | Description |
|------|-------------|
| `useForm(options)` | Main form hook |
| `useField(name, schema)` | Single field hook |

### Vanilla (`form-ready/vanilla`)

| Function | Description |
|----------|-------------|
| `initForm(form, config)` | Initialize form |
| `validateFieldByName(form, name, schema)` | Validate field |
| `resetForm(form)` | Reset form |
| `setFieldValue(form, name, value)` | Set field value |
| `setFieldError(form, name, message)` | Set error |
| `getFormValues(form)` | Get all values |

## License

MIT