export function mockResetAll(mock: any) {
    if (!mock) {
        return
    }

    Object.keys(mock).forEach((key) => {
        const value = mock[key]
        if (value && value.mockReset) {
            value.mockReset()
        }
    })
}
