type Service = {
    name: string,
    version: string,
}

const ExampleService = (): Service => ({
    name: 'Example Service',
    version: '1.1'
})

// Eventually add code here to demonstrate the simple service.
// Routes:
//   - health/
//   - metrics/
//   - api/v1/quote/