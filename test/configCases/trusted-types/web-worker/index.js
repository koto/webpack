it("should allow to create a WebWorker", async () => {
    const noop = (i) => i
	const rules = {
		createScriptURL: noop,
	}
	window.trustedTypes = {
		createPolicy: () => rules
	}
	const createScriptURLSpy = jest.spyOn(rules, 'createScriptURL')
	const createPolicySpy = jest.spyOn(window.trustedTypes, 'createPolicy')

	const worker = new Worker(new URL("./worker.js", import.meta.url), {
		type: "module"
	});
    expect(createScriptURLSpy.mock.calls[0][0].toString()).toEqual('https://test.cases/path/chunk.web.js');
	expect(createPolicySpy).toHaveBeenCalledWith('webpack', expect.anything())

	worker.postMessage("ok");
	const result = await new Promise(resolve => {
		worker.onmessage = event => {
			resolve(event.data);
		};
	});
	expect(result).toBe("data: ok, thanks");
	await worker.terminate();
});