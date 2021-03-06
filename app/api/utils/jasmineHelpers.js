export function catchErrors(done) {
  return (error) => {
    if (error instanceof Error) {
      return done.fail(error.stack);
    }
    return done.fail(JSON.stringify(error));
  };
}

const matchers = {
  toNeedAuthorization() {
    return {
      compare(routeResult) {
        let status;
        const req = {};
        const next = () => {};
        const res = { status: (code) => { status = code; }, json: () => {} };

        routeResult.middlewares[0](req, res, next);

        const result = { pass: status === 401 };
        if (result.pass) {
          result.message = () => 'route is authorized';
        } else {
          result.message = () => 'Route is not authorized ! (Auth middleware should be the first one)';
        }
        return result;
      }
    };
  },
  containItems() {
    return {
      compare(actual, expected) {
        const result = {};
        const missingItems = expected.filter(item => !actual.includes(item));
        result.pass = !missingItems.length && actual.length === expected.length;
        if (result.pass) {
          result.message = 'Collections are equal';
        } else {
          result.message = `Expected: [${expected}] but got: [${actual}]`;
        }
        return result;
      }
    };
  },
  toContainEqual: jasmine.matchers ? jasmine.matchers.toContain : () => {}
};

beforeEach(() => {
  jasmine.addMatchers(matchers);
});
