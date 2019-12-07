/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
// import * as sinon from 'sinon';
import * as Rx from 'rxjs';

import { Krix } from './krix';
import { Interfaces } from './shared';

describe(`Krix`, () => {
  describe(`create`, () => {
    describe(`when method is invoked`, () => {
      it('should return instance of Krix', () => {
        const krixInst = Krix.create();
        expect(krixInst).to.be.an.instanceOf(Krix);
      });
    });
  });

  describe(`new`, () => {
    describe(`when instance of class is created`, () => {
      it('should create "sjStoreChanges" and "sjStopSignal" RxJS Subjects', () => {
        const krixInst = new Krix();
        expect(krixInst['sjStoreChanges']).to.be.an.instanceOf(Rx.Subject);
        expect(krixInst['sjStopSignal']).to.be.an.instanceOf(Rx.Subject);
      });
    });
  });

  describe(`init`, () => {
    let krix: Krix<any>;
    beforeEach(() => {
      krix = new Krix();
    });

    describe(`when method is invoked without options`, () => {
      it('should set "options" property in instance to empty object', () => {
        const options: any = undefined;
        krix.init(options);
        expect(krix[`options`]).to.be.an(`object`);
      });
    });
    describe(`when method is invoked with null instead of options`, () => {
      it('should set "options" property in instance to empty object', () => {
        const options: any = null;
        krix.init(options);
        expect(krix[`options`]).to.be.an(`object`);
      });
    });
    describe(`when method is invoked with array instead of options`, () => {
      it('should set "options" property in instance to empty object', () => {
        const options: any = [];
        krix.init(options);
        expect(krix[`options`]).to.be.an(`object`);
      });
    });
    describe(`when method is invoked with options`, () => {
      it('should set "options" property in instance to copy of options', () => {
        const options: any = {
          coolOptions: `option`,
        };
        krix.init(options);
        expect(krix[`options`]).to.deep.equal(options);
      });
      describe(`and options doesn't have "initStore" property`, () => {
        it('should set "store" property in instance to empty object', () => {
          const options: any = {
            coolOptions: `option`,
          };
          expect(krix[`store`]).to.be.undefined;
          krix.init(options);
          expect(krix[`store`]).to.be.an(`object`);
        });
      });
      describe(`and options has "initStore" property`, () => {
        it('should set "store" property in instance to copy of "initStore" property', () => {
          const options: any = {
            coolOptions: `option`,
            initStore: {
              'megaStore': {
                hello: 'World!',
              },
            },
          };
          expect(krix[`store`]).to.be.undefined;
          krix.init(options);
          expect(krix[`store`].megaStore.hello).to.equal(options.initStore.megaStore.hello);
        });
      });
    });
  });

  describe(`getStatePath`, () => {
    let krix: Krix<any>;
    beforeEach(() => {
      krix = new Krix();
    });

    describe(`when method is invoked without state`, () => {
      it('should return empty path', () => {
        const arg: any = undefined;
        const result = krix['getStatePath'](arg);
        expect(result).to.equal(``);
      });
    });
    describe(`when method is invoked with non-array state`, () => {
      it('should return empty string', () => {
        const args: any[] = [ null, 0, ``, `Hello!`, { hello: `world` } ];
        args.forEach((arg: any) => {
          const result = krix['getStatePath'](arg);
          expect(result).to.equal(``);
        });
      });
    });
    describe(`when method is invoked with empty array state`, () => {
      it('should return empty string', () => {
        const arg: any = [];
        const result = krix['getStatePath'](arg);
        expect(result).to.equal(``);
      });
    });
    describe(`when method is invoked with non-empty array state`, () => {
      describe(`and state has one string values`, () => {
        it('should return correct non-empty string', () => {
          const arg: any = [ `hello` ];
          const result = krix['getStatePath'](arg);
          expect(result).to.equal(`hello`);
        });
      });
      describe(`and parts of state have string values`, () => {
        it('should return correct non-empty string', () => {
          const arg: any = [ `hello`, `world` ];
          const result = krix['getStatePath'](arg);
          expect(result).to.equal(`hello.world`);
        });
      });
      describe(`and parts of state have number values`, () => {
        it('should return correct non-empty string', () => {
          const arg: any = [ 4, 5 ];
          const result = krix['getStatePath'](arg);
          expect(result).to.equal(`4.5`);
        });
      });
      describe(`and parts of state have object values`, () => {
        it('should return correct non-empty string', () => {
          const arg: any = [ { hello: `world` }, { a: `b` } ];
          const result = krix['getStatePath'](arg);
          expect(result).to.equal(`[object Object].[object Object]`);
        });
      });
    });
  });

  describe(`getStateByPath`, () => {
    const mockStore = {
      user: {
        id: 51,
        fName: `Ivan`,
        lName: `Ivanov`,
      },
    };

    let krix: Krix<any>;
    beforeEach(() => {
      krix = Krix.create<any>({
        initStore: mockStore,
      });
    });

    describe(`when method is invoked without state path`, () => {
      it('should return store', () => {
        const arg: any = undefined;
        const result = krix.getStateByPath(arg);
        expect(result).to.deep.equal(mockStore);
      });
    });
    describe(`when method is invoked with non-string state path`, () => {
      it('should return store', () => {
        const args: any[] = [ null, 0, [ `Hello!` ], { hello: `world` } ];
        args.forEach((arg: any) => {
          const result = krix.getStateByPath(arg);
          expect(result).to.deep.equal(mockStore);
        });
      });
    });
    describe(`when method is invoked with empty state path`, () => {
      it('should return store', () => {
        const arg: any = [];
        const result = krix.getStateByPath(arg);
        expect(result).to.deep.equal(mockStore);
      });
    });
    describe(`when method is invoked with non-empty state path`, () => {
      describe(`and state exists in store`, () => {
        it('should return state', () => {
          const arg: any = `user.fName`;
          const result = krix.getStateByPath(arg);
          expect(result).to.equal(mockStore.user.fName);
        });
      });
      describe(`and state doesn't exist in store`, () => {
        it('should return undefined', () => {
          const arg: any = `user.mName`;
          const result = krix.getStateByPath(arg);
          expect(result).to.be.undefined;
        });
      });
    });
  });

  describe(`getState`, () => {
    const mockStore = {
      user: {
        id: 51,
        fName: `Ivan`,
        lName: `Ivanov`,
      },
    };

    let krix: Krix<any>;
    beforeEach(() => {
      krix = Krix.create<any>({
        initStore: mockStore,
      });
    });

    describe(`when method is invoked without state`, () => {
      it('should return store', () => {
        const arg: any = undefined;
        const result = krix.getState(arg);
        expect(result).to.deep.equal(mockStore);
      });
    });
    describe(`when method is invoked with non-array state`, () => {
      it('should return store', () => {
        const args: any[] = [ null, 0, ``, `Hello!`, { hello: `world` } ];
        args.forEach((arg: any) => {
          const result = krix.getState(arg);
          expect(result).to.deep.equal(mockStore);
        });
      });
    });
    describe(`when method is invoked with empty array state`, () => {
      it('should return store', () => {
        const arg: any = [];
        const result = krix.getState(arg);
        expect(result).to.deep.equal(mockStore);
      });
    });
    describe(`when method is invoked with non-empty array state`, () => {
      describe(`and state exists in store`, () => {
        it('should return state', () => {
          const arg: any = [ `user`, `fName` ];
          const result = krix.getState(arg);
          expect(result).to.equal(mockStore.user.fName);
        });
      });
      describe(`and state doesn't exist in store`, () => {
        it('should return undefined', () => {
          const arg: any = [ `user`, `mName` ];
          const result = krix.getState(arg);
          expect(result).to.be.undefined;
        });
      });
    });
  });

  describe(`setState`, () => {
    const mockStore = {
      user: {
        id: 51,
        fName: `Ivan`,
        lName: `Ivanov`,
      },
    };

    let krix: Krix<any>;
    beforeEach(() => {
      krix = Krix.create<any>({
        initStore: mockStore,
      });
    });

    describe(`when method is invoked without state action`, () => {
      it('should throw error', () => {
        const resultError = new Error(`Krix - setState: State action isn't exist`);
        let methodError: any;

        try {
          const arg: any = undefined;
          krix.setState(arg);
        } catch (error) {
          methodError = error;
          expect(error.toString()).to.deep.equal(resultError.toString());
        }

        expect(methodError).to.not.null;
        expect(methodError).to.not.undefined;
      });
    });

    describe(`when method is invoked with state action`, () => {
      describe(`but state doesn't have an 'array' type`, () => {
        it('should throw error', () => {
          const resultError = new Error(`Krix - setState: State doesn't have an 'array' type`);
          let methodError: any;

          try {
            const arg: any = {};
            krix.setState(arg);
          } catch (error) {
            methodError = error;
            expect(error.toString()).to.deep.equal(resultError.toString());
          }

          expect(methodError).to.not.null;
          expect(methodError).to.not.undefined;
        });
      });
      describe(`and state is an empty array`, () => {
        it('should not update store', () => {
          const arg: Interfaces.StateAction = {
            state: [],
            value: `Hello World!`,
          };

          krix.setState(arg);
          const result = krix.getState();
          expect(result).to.deep.equal(mockStore);
        });
      });
      describe(`and state is a path to non-existing property`, () => {
        it('should create new property in the store', () => {
          const arg: Interfaces.StateAction = {
            state: [ `user`, `mName` ],
            value: `Dima`,
          };

          const oldStore = krix.getState();
          expect(oldStore[arg.state[0]][arg.state[1]])
            .to.be.undefined;

          krix.setState(arg);

          const newStore = krix.getState();
          expect(newStore[arg.state[0]][arg.state[1]])
            .to.equal(arg.value);
        });
      });
      describe(`and state is a path to existing property`, () => {
        it('should update property in the store', () => {
          const arg: Interfaces.StateAction = {
            state: [ `user`, `fName` ],
            value: `Dima`,
          };

          const oldStore = krix.getState();
          expect(oldStore[arg.state[0]][arg.state[1]])
            .to.equal((mockStore as any)[arg.state[0]][arg.state[1]]);

          krix.setState(arg);

          const newStore = krix.getState();
          expect(newStore[arg.state[0]][arg.state[1]])
            .to.equal(arg.value);
        });
      });
    });
  });
});