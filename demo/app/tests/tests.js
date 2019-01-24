var TNSCall = require("nativescript-call").TNSCall;
var call = new TNSCall();

describe("receiveCall function", function () {
  it("exists", function () {
    expect(call.receiveCall).toBeDefined();
  });

  it("returns a promise", function () {
    expect(call.receiveCall()).toEqual(jasmine.any(Promise));
  });
});

describe("endCall function", function () {
  it("exists", function () {
    expect(call.endCall).toBeDefined();
  });

  it("returns a promise", function () {
    expect(call.endCall()).toEqual(jasmine.any(Promise));
  });
});