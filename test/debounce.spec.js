import { debounce } from '../src/index.js';
import { delay } from './common/index.js';
import { jest } from '@jest/globals';

function createCounter() {
	let counter = 0;
	const fn = function() {
		counter++;
		return counter;	
	}
	Object.defineProperty(fn, 'value', {
		get: () => counter
	});
	
	return fn;
}

describe('debounce', () => {
	
	let increment;
	
	beforeEach(() => {
		increment = createCounter();
	});

	
	test("should be called once in certain period of time", async () => {

		expect(increment.value).toBe(0);

		const debouncedIncr = debounce(increment, 0);

		debouncedIncr();

		debouncedIncr();

		debouncedIncr();

		debouncedIncr();

		debouncedIncr();

		
		await delay(0);
		
		
		
		expect(increment.value).toBe(1);
		
	});

	test('should not be called if cancel called', async () => {
		expect(increment.value).toBe(0);
		const debouncedIncr = debounce(increment, 0);
    debouncedIncr();
    debouncedIncr.cancel();
		await delay();
		expect(increment.value).toBe(0);
	});

	test('should call debounced function immediate if such argument passed', async () => {
		expect(increment.value).toBe(0);
		const debouncedIncr = debounce(increment, 64, true);
		const a = debouncedIncr();
		const b = debouncedIncr();
		expect(a).toBe(1);
		expect(b).toBe(1);
		expect(increment.value).toBe(1);
		delay(16, debouncedIncr);
		delay(32, debouncedIncr);
		// const finish = () => {
    //   expect(increment.value).toBe(1); //, 1, 'incr was debounced');
    //   const c = debouncedIncr();
    //   expect(c).toBe(2);
    //   expect(increment.value).toBe(2); //, 2, 'incr was called again');
    //   done();			
		// }
		delay(48, () => {
			debouncedIncr();
      //delay(80, finish);
		})

		await delay(48 + 80);

		expect(increment.value).toBe(1); //, 1, 'incr was debounced');
		const c = debouncedIncr();
		expect(c).toBe(2);
		expect(increment.value).toBe(2); //, 2, 'incr was called again');

	});

});


/*




  QUnit.test('debounce asap cancel', function(assert) {
    assert.expect(4);
    var done = assert.async();
    var a, b;
    var counter = 0;
    var incr = function(){ return ++counter; };
    var debouncedIncr = _.debounce(incr, 64, true);
    a = debouncedIncr();
    debouncedIncr.cancel();
    b = debouncedIncr();
    assert.strictEqual(a, 1);
    assert.strictEqual(b, 2);
    assert.strictEqual(counter, 2, 'incr was called immediately');
    _.delay(debouncedIncr, 16);
    _.delay(debouncedIncr, 32);
    _.delay(debouncedIncr, 48);
    _.delay(function(){ 
			assert.strictEqual(counter, 2, 'incr was debounced'); 
			done(); 
		}, 128);
  });

  QUnit.test('debounce asap recursively', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var counter = 0;
    var debouncedIncr = _.debounce(function(){
      counter++;
      if (counter < 10) debouncedIncr();
    }, 32, true);
    debouncedIncr();
    assert.strictEqual(counter, 1, 'incr was called immediately');
    _.delay(function(){ assert.strictEqual(counter, 1, 'incr was debounced'); done(); }, 96);
  });

  QUnit.test('debounce after system time is set backwards', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var counter = 0;
    var debouncedIncr = _.debounce(function(){
      counter++;
    }, 100, true);
    var originalNowFunc = Date.now;
    var originalGetTimeFunc = Date.prototype.getTime;

    debouncedIncr();
    assert.strictEqual(counter, 1, 'incr was called immediately');

    Date.prototype.getTime = function() {
      return +(new Date(2013, 0, 1, 1, 1, 1));
    }
    Date.now = function() {
      return +(new Date(2013, 0, 1, 1, 1, 1));
    }

    _.delay(function() {
      debouncedIncr();
      assert.strictEqual(counter, 2, 'incr was debounced successfully, with tampered system time');
      done();
      Date.now = originalNowFunc;
      Date.prototype.getTime = originalGetTimeFunc;
    }, 200);
  });

  QUnit.test('debounce after system time is is not accessible (or in invalid format)', function(assert) {
    assert.expect(3);
    var done = assert.async();
    var counter = 0;
    var debouncedIncr = _.debounce(function(){
      counter++;
    }, 100, true);
    var originalNowFunc = Date.now;
    var originalGetTimeFunc = Date.prototype.getTime;
    var originalValueOfFunc = Date.prototype.valueOf;

    debouncedIncr();
    assert.strictEqual(counter, 1, 'incr was called immediately');

    Date.prototype.valueOf = function() {
      return null;
    };
    Date.prototype.getTime = function() {
      return null;
    };
    Date.now = function() {
      return null;
    };

    _.delay(function() {
      debouncedIncr();
      assert.strictEqual(counter, 2, 'incr was debounced successfully, with tampered system time');
      Date.now = originalNowFunc;
      Date.prototype.getTime = originalGetTimeFunc;
      Date.prototype.valueOf = originalValueOfFunc;
    }, 200);

    _.delay(function() {
      debouncedIncr();
      assert.strictEqual(counter, 3, 'incr was debounced successfully, after system time method restoration');
      done();
    }, 400);
  });

  QUnit.test('debounce re-entrant', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var sequence = [
      ['b1', 'b2']
    ];
    var value = '';
    var debouncedAppend;
    var append = function(arg){
      value += this + arg;
      var args = sequence.pop();
      if (args) {
        debouncedAppend.call(args[0], args[1]);
      }
    };
    debouncedAppend = _.debounce(append, 32);
    debouncedAppend.call('a1', 'a2');
    assert.strictEqual(value, '');
    _.delay(function(){
      assert.strictEqual(value, 'a1a2b1b2', 'append was debounced successfully');
      done();
    }, 100);
  });
*/