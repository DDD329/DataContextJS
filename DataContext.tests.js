describe("class DataContext2", function() {
  it("test 1", () => {
    let ctx = new DataContext({ a: 4, b: 3, c: null });
    
    ctx.calc( 'c', [ 'a', 'b' ], ( a, b ) => a + b );
    
    assert.deepEqual( ctx.get( '' ), { a: 4, b: 3, c: 7 });  
  });
  
  it("test 2", () => {
    let ctx = new DataContext({ a: 4, b: 3 });
    
    ctx.calc( 'c', [ 'a', 'b' ], ( a, b ) => a + b );
    
    assert.deepEqual( ctx.get( '' ), { a: 4, b: 3, c: 7 });
  });
  
  it("test 3", () => {
    let ctx = new DataContext({ a: 4, b: 3, c: 7 });
    
    ctx.calc( 'c', [ 'a', 'b' ], ( a, b ) => undefined );
    
    assert.deepEqual( ctx.get( '' ), { a: 4, b: 3 });
  });
  
  it("test 4", () => {
    let ctx = new DataContext({ b: 3, c: null });

    ctx.calc( 'c', [ 'a', 'b' ], ( a, b ) => { 
      return a === undefined ? undefined : a + b;
    });
    
    assert.deepEqual( ctx.get( '' ), { b: 3 });
  });
  
  it("test 5", () => {
    let ctx = new DataContext({ b: 3, c: null });

    ctx.calc( 'c', [ 'a', 'b' ], ( a, b ) => { 
      return a === undefined ? undefined : a + b;
    });
    
    ctx.set( 'a', 4 );
    
    assert.deepEqual( ctx.get( '' ), { a: 4, b: 3, c: 7 });
  });
});

describe("class DataContext", function() {
  describe("Данные: { x: 1, y: 2, a: null, b: null, c: null }, где 1) a = x * y; 2) b = x + y; 3) c = a + b", () => {
    let dataContext = null;
    
    beforeEach(() => { 
      dataContext = new DataContext({ x: 1, y: 2, a: null, b: null, c: null });  
    });
    
    afterEach(() => { dataContext = null; });
    
    let calcA = () => { dataContext.calc( 'a', [ 'x', 'y' ], ( x, y ) => x * y ); };
    let calcB = () => { dataContext.calc( 'b', [ 'x', 'y' ], ( x, y ) => x + y ); };
    let calcC = () => { dataContext.calc( 'c', [ 'a', 'b' ], ( a, b ) => a + b ); };
    
    it("Порядок объявления в calc: a, b, c => { x: 1, y: 2, a: 2, b: 3, c: 5 }", () => {
      calcA();
      calcB();
      calcC();

      assert.deepEqual( dataContext.get( '' ), { x: 1, y: 2, a: 2, b: 3, c: 5 } );  
    });
    
    it("Порядок объявления в calc: a, c, b => { x: 1, y: 2, a: 2, b: 3, c: 5 }", () => {
      calcA();
      calcC();
      calcB();
      
      assert.deepEqual( dataContext.get( '' ), { x: 1, y: 2, a: 2, b: 3, c: 5 } );  
    });
    
    it("Порядок объявления в calc: b, a, c => { x: 1, y: 2, a: 2, b: 3, c: 5 }", () => {
      calcB();
      calcA();
      calcC();
      
      assert.deepEqual( dataContext.get( '' ), { x: 1, y: 2, a: 2, b: 3, c: 5 } );  
    });
    
    it("Порядок объявления в calc: b, c, a => { x: 1, y: 2, a: 2, b: 3, c: 5 }", () => {
      calcB();
      calcC();
      calcA();
      
      assert.deepEqual( dataContext.get( '' ), { x: 1, y: 2, a: 2, b: 3, c: 5 } );  
    });
    
    it("Порядок объявления в calc: c, a, b => { x: 1, y: 2, a: 2, b: 3, c: 5 }", () => {
      calcC();
      calcA();
      calcB();
      
      assert.deepEqual( dataContext.get( '' ), { x: 1, y: 2, a: 2, b: 3, c: 5 } );  
    });
    
    it("Порядок объявления в calc: c, b, a => { x: 1, y: 2, a: 2, b: 3, c: 5 }", () => {
      calcC();
      calcB();
      calcA();
      
      assert.deepEqual( dataContext.get( '' ), { x: 1, y: 2, a: 2, b: 3, c: 5 } );
    });
    
    it("Изменяем x на 3 => { x: 3, y: 2, a: 6, b: 5, c: 11 }", () => {
      calcA();
      calcB();
      calcC();
      
      dataContext.set( 'x', 3 );
      
      assert.deepEqual( dataContext.get( '' ), { x: 3, y: 2, a: 6, b: 5, c: 11 });  
    });
    
    it("Изменяем y на 4 => { x: 1, y: 4, a: 4, b: 5, c: 9 }", () => {
      calcA();
      calcB();
      calcC();
      
      dataContext.set( 'y', 4 );
      
      assert.deepEqual( dataContext.get( '' ), { x: 1, y: 4, a: 4, b: 5, c: 9 });  
    });
    
    it("При попытке изменить вычисляемое свойсто, состояние не меняется", () => {
      calcA();
      calcB();
      calcC();
      
      dataContext.set( 'a', 7 );
      
      assert.deepEqual( dataContext.get( '' ), { x: 1, y: 2, a: 2, b: 3, c: 5 } );
    });
    
    it("Изменяем x на 3 и y на 5 => { x: 3, y: 5, a: 15, b: 8, c: 23 }", () => {
      calcA();
      calcB();
      calcC();
      
      dataContext.set( 'x', 3 );
      dataContext.set( 'y', 5 );
      
      assert.deepEqual( dataContext.get( '' ), { x: 3, y: 5, a: 15, b: 8, c: 23 } );  
    });
    
    it("Передаем func в calc как лямбда-функцию => 'this' НЕ является типом DataContext", () => {
      calcA();
      calcB();
      
      let thisIsDataContext = false;
      
      dataContext.calc( 'c', [ 'a', 'b' ], ( a, b ) => { 
        thisIsDataContext = dataContext === this;
        
        return a + b; 
      });

      assert.isNotOk( thisIsDataContext );
    });
    
    it("Передаем func в calc как обычную функцию => 'this' является типом DataContext", () => {
      calcA();
      calcB();
      
      let thisIsDataContext = false;
      
      dataContext.calc( 'c', [ 'a', 'b' ], function( a, b ) {
        thisIsDataContext = dataContext === this;

        return a + b; 
      });

      assert.isOk( thisIsDataContext );
    });    
  });
  
  describe("get( keypath )", () => {
    it("( undefined ) => ReferenceError('keypath')", () => {
      let dataContext = new DataContext({ a: 123 });
      
      assert.throws(() => { dataContext.get( undefined ); }, ReferenceError, 'keypath');
    });
    
    it("( null ) => ReferenceError('keypath')", () => {
      let dataContext = new DataContext({ a: 123 });
      
      assert.throws(() => { dataContext.get( null ); }, ReferenceError, 'keypath');
    });
    
    it("Значение по несуществующему пути вернет undefined", () => {
      
      let dataContext = new DataContext( { a: 123 } );
      
      let val = dataContext.get( 'x.y.z' );
      
      assert.isUndefined( val );
    });
    
    it("Из контекста { a: null } по пути 'a' вернет null", () => {
      let data = { a: null };
      
      let dataContext = new DataContext( data );
      
      let val = dataContext.get( 'a' );
      
      assert.isNull( val );
    });
    
    it("Из контекста { a: { b: { c: 777 }}} по пути '' вернет глубокую копию значения - { a: { b: { c: 777 }}}", () => {
      let data = { a: { b: { c: 777 } } };
      
      let dataContext = new DataContext( data );
      
      let ctx = dataContext.get( '' );
      
      assert.deepEqual( ctx, { a: { b: { c: 777 }}} );
      assert.notEqual( ctx, data, 'ссылки должны быть разные' );
      assert.notEqual( ctx.a, data.a, 'ссылки должны быть разные' );
      assert.notEqual( ctx.a.b, data.a.b, 'ссылки должны быть разные' );      
    });
    
    it("Из контекста { a: { b: { c: 777 }}} по пути 'a' вернет глубокую копию значения - { b: { c: 777 } }", () => {
      let data = { a: { b: { c: 777 } } };
      
      let dataContext = new DataContext({ data: data });
      
      let a = dataContext.get( 'a' );
      
      assert.deepEqual( a, { b: { c: 777 }} );
      assert.notEqual( a, data.a, 'ссылки должны быть разные' );
      assert.notEqual( a.b, data.a.b, 'ссылки должны быть разные' );      
    });
    
    it("Из контекста { arr: [ { x: 123 }, { y: 456 }, { z: 789 } ] } по пути 'arr' вернет глубокую копию массива", () => {
      let data = { arr: [ { x: 123 }, { y: 456 }, { z: 789 } ] };
      
      let dataContext = new DataContext({ data: data });
      
      let arr = dataContext.get( 'arr' );
      
      assert.deepEqual( arr, [ { x: 123 }, { y: 456 }, { z: 789 } ]);
      assert.notEqual( arr, data.arr, 'ссылки должны быть разные' );
      assert.notEqual( arr[ 0 ], data.arr[ 0 ], 'ссылки должны быть разные' );
      assert.notEqual( arr[ 1 ], data.arr[ 1 ], 'ссылки должны быть разные' );
      assert.notEqual( arr[ 2 ], data.arr[ 2 ], 'ссылки должны быть разные' );
    });
    
    
  });
  
  describe("set( keypath, value )", function(){
    it("( undefined, 123 ) => ReferenceError('keypath')", () => {
      let dataContext = new DataContext({ x: 1, y: 2, a: null, b: null, c: null });
      
      assert.throws(() => { dataContext.set( undefined, 123 ); }, ReferenceError, 'keypath');
    });
    
    it("( null, 123 ) => ReferenceError('keypath')", () => {
      let dataContext = new DataContext({ x: 1, y: 2, a: null, b: null, c: null });
      
      assert.throws(() => { dataContext.set( null, 123 ); }, ReferenceError, 'keypath');
    });
    
    it("( {}, 123 ) => TypeError( 'keypath: must has type of string' )", function() {
      let dataContext = new DataContext({ x: 1, y: 2, a: null, b: null, c: null });
      
      assert.throws( () => { dataContext.set( {}, 123 );  }, TypeError, 'keypath: must has type of string'  );
    });
    
    it("( 'a.b.c', func ) => TypeError( 'value must be not function' )", function() {
      let dataContext = new DataContext({ a: { b:{ c: {}}}});
      
      let func = function() {};
      
      assert.throws( () => { dataContext.set( 'a.b.c', func );  }, TypeError, 'value must be not function' );
    });
    
    it("( 'a.b.c', regexp ) => TypeError( 'value must be not regexp' )", function() {
      let dataContext = new DataContext({ a: { b:{ c: {}}}});
      
      let regexp = new RegExp();
      
      assert.throws( () => { dataContext.set( 'a.b.c', regexp );  }, TypeError, 'value must be not regexp' );
    });
    
    it("Если попытаться установить значение для вычисляемого свойства 'c', то будет выброшенно исключение: Error(\"Cannot set value for calc property: 'c'\")", function() {
      let dataContext = new DataContext({ data: { a: 2, b: 3, c: null } });
      
      dataContext.calc( 'c', [ 'a', 'b' ], ( a, b ) => a + b );
      
      assert.throws( () => { dataContext.set( 'c', 5 ); }, Error, "Cannot set value for calc property: 'c'" );
    });
    
    it("В контексте { a: 123, b: 456 } изменяем 'a' на 777, получаем { a: 777, b: 456 }", () => {
      let dataContext = new DataContext({ data: { a: 123, b: 456 } });
      
      dataContext.set( 'a', 777 );
      
      assert.deepEqual( dataContext.get(''), { a: 777, b: 456 } );
    });
    
    it("В контексте { a: 123 } установливаем значение 777 по пути 'x.y.z', получаем { a: 123, x: { y: { z: 777 }}}", () => {
      let dataContext = new DataContext({ data: { a: 123 } });
      
      dataContext.set( 'x.y.z', 777 );

      assert.deepEqual( dataContext.get(''), { a: 123, x: { y: { z: 777 }}} );
    });
    
    describe("Когда keypath пустая строка( '' )", () => {
      it("То value может быть только объектом { ... }", () => {
        let dataContext = new DataContext({ data: { a: 123 } });
        
        let newValue = { x: 123, y: 456, z: 789 };
             
        assert.doesNotThrow( () => { dataContext.set( '', newValue ); }, Error );
      });
      
      it("Иначе если value undefined, то будет выброшенно исключение TypeError( 'set: value must be object when keypath is empty' )", () => {
        let dataContext = new DataContext({ data: { a: 123 } });
        
        let newValue = undefined;
        
        assert.throws( () => { dataContext.set( '', newValue ); }, TypeError, "set: value must be object when keypath is empty" );
      });
      
      it("Иначе если value null, то будет выброшенно исключение TypeError( 'set: value must be object when keypath is empty' )", () => {
        let dataContext = new DataContext({ data: { a: 123 } });
        
        let newValue = null;
        
        assert.throws( () => { dataContext.set( '', newValue ); }, TypeError, "set: value must be object when keypath is empty" );
      });
      
      it("Иначе если value boolean, то будет выброшенно исключение TypeError( 'set: value must be object when keypath is empty' )", () => {
        let dataContext = new DataContext({ data: { a: 123 } });
        
        let newValue = true;
        
        assert.throws( () => { dataContext.set( '', newValue ); }, TypeError, "set: value must be object when keypath is empty" );
      });
      
      it("Иначе если value number, то будет выброшенно исключение TypeError( 'set: value must be object when keypath is empty' )", () => {
        let dataContext = new DataContext({ data: { a: 123 } });
        
        let newValue = 123;
        
        assert.throws( () => { dataContext.set( '', newValue ); }, TypeError, "set: value must be object when keypath is empty" );
      });
      
      it("Иначе если value string, то будет выброшенно исключение TypeError( 'set: value must be object when keypath is empty' )", () => {
        let dataContext = new DataContext({ data: { a: 123 } });
        
        let newValue = 'str';
        
        assert.throws( () => { dataContext.set( '', newValue ); }, TypeError, "set: value must be object when keypath is empty" );
      });
      
      it("Иначе если value function, то будет выброшенно исключение TypeError( 'set: value must be object when keypath is empty' )", () => {
        let dataContext = new DataContext({ data: { a: 123 } });
        
        let newValue = function(){};
        
        assert.throws( () => { dataContext.set( '', newValue ); }, TypeError, "set: value must be object when keypath is empty" );
      });
      
      it("Иначе если value array, то будет выброшенно исключение TypeError( 'set: value must be object when keypath is empty' )", () => {
        let dataContext = new DataContext({ data: { a: 123 } });
        
        let newValue = [];
        
        assert.throws( () => { dataContext.set( '', newValue ); }, TypeError, "set: value must be object when keypath is empty" );
      });
      
      it("Иначе если value date, то будет выброшенно исключение TypeError( 'set: value must be object when keypath is empty' )", () => {
        let dataContext = new DataContext({ data: { a: 123 } });
        
        let newValue = new Date();
        
        assert.throws( () => { dataContext.set( '', newValue ); }, TypeError, "set: value must be object when keypath is empty" );
      });
      
      it("Иначе если value regexp, то будет выброшенно исключение TypeError( 'set: value must be object when keypath is empty' )", () => {
        let dataContext = new DataContext({ data: { a: 123 } });
        
        let newValue = new RegExp();
                
        assert.throws( () => { dataContext.set( '', newValue ); }, TypeError, "set: value must be object when keypath is empty" );
      });
      
      it("Иначе если value Map, то будет выброшенно исключение TypeError( 'set: value must be object when keypath is empty' )", () => {
        let dataContext = new DataContext({ data: { a: 123 } });
        
        let newValue = new Map();
                
        assert.throws( () => { dataContext.set( '', newValue ); }, TypeError, "set: value must be object when keypath is empty" );
      });
      
      it("Иначе если value Set, то будет выброшенно исключение TypeError( 'set: value must be object when keypath is empty' )", () => {
        let dataContext = new DataContext({ data: { a: 123 } });
        
        let newValue = new Set();
                
        assert.throws( () => { dataContext.set( '', newValue ); }, TypeError, "set: value must be object when keypath is empty" );
      });
      
      it("Иначе если value WeakMap, то будет выброшенно исключение TypeError( 'set: value must be object when keypath is empty' )", () => {
        let dataContext = new DataContext({ data: { a: 123 } });
        
        let newValue = new WeakMap();
                
        assert.throws( () => { dataContext.set( '', newValue ); }, TypeError, "set: value must be object when keypath is empty" );
      });
      
      it("Иначе если value WeakSet, то будет выброшенно исключение TypeError( 'set: value must be object when keypath is empty' )", () => {
        let dataContext = new DataContext({ data: { a: 123 } });
        
        let newValue = new WeakSet();
                
        assert.throws( () => { dataContext.set( '', newValue ); }, TypeError, "set: value must be object when keypath is empty" );
      });
      
      it("Иначе если value Symbol, то будет выброшенно исключение TypeError( 'set: value must be object when keypath is empty' )", () => {
        let dataContext = new DataContext({ data: { a: 123 } });
        
        let newValue = Symbol( 'foo' );
                
        assert.throws( () => { dataContext.set( '', newValue ); }, TypeError, "set: value must be object when keypath is empty" );
      });
    });
    
    
    
    /*
      Тест 1: Если value объект или массив, который содержит функцию и регулярное выражение, то
      ошибки не будет, свойство объекта будет проигнорированно
    */
  });
  
  describe("observe( keypath, callback[, options ])", () => {
    it("Если в options параметр init установлен в true, то при объявлении будет вызван callback", () => {
      let dataContext = new DataContext({ data: { a: 123 } });

      let wasCalled = false;
      
      dataContext.observe( 'x', () => { wasCalled = true; }, { init: true });
      
      assert.isOk( wasCalled );      
    });
    
    it("Если в options параметр init установлен в false, то при объявлении не будет вызван callback", () => {
      let dataContext = new DataContext({ data: { a: 123 } });

      let wasCalled = false;
      
      dataContext.observe( 'x', () => { wasCalled = true; }, { init: false });
      
      assert.isNotOk( wasCalled );     
    });
    
    it("Если в options параметр init не установлен, то по умолчанию true", () => {
      let dataContext = new DataContext({ data: { a: 123 } });

      let wasCalled = false;
      
      dataContext.observe( 'x', () => { wasCalled = true; }, {});
      
      assert.isOk( wasCalled );      
    });
    
    it("В контексте { a: 123 } объявляем наблюдение за свойством 'x', где старое и новое значение будет равно undefined", () => {
      let dataContext = new DataContext({ 
        data: { a: 123 }
      });

      let success = false;
      
      dataContext.observe( 'x', function( newValue, oldValue, keypath ){
        assert.isUndefined( newValue, 'newValue must be undefined' );
        assert.isUndefined( oldValue, 'oldValue must be undefined' );
        assert.strictEqual( keypath, 'x' );        
        success = true;
      });
      
      assert.isOk( success );
      
    });
    
    it("В контексте { a: 123 } объявляем наблюдение за свойством 'a', где старое значение будет равно undefined, а новое 123", () => {
      let dataContext = new DataContext({ 
        data: { a: 123 }
      });

      let success = false;
      
      dataContext.observe( 'a', function( newValue, oldValue, keypath ){
        assert.equal( newValue, 123, 'newValue must be equal to 123' );
        assert.isUndefined( oldValue, 'oldValue must be undefined' );
        assert.strictEqual( keypath, 'a' );        
        success = true;
      });
      
      assert.isOk( success );      
    });
    
    it("В контексте { a: { b: { c: 777 }}} объявляем наблюдение за свойством 'a', в callback передается копия значения", () => {
      let data = { a: { b: { c: 777 }}};
      
      let dataContext = new DataContext({ data: data });

      let success = false;
      
      dataContext.observe( 'a', function( newValue, oldValue, keypath ){
        assert.deepEqual( newValue, { b: { c: 777 }}, 'newValue must be deep equal to { b: { c: 777 }}' );
        assert.notEqual( newValue, data.a, 'newValue не равен по ссылке data.a');
        assert.notEqual( newValue.b, data.a.b, 'newValue не равен по ссылке data.a.b');
        success = true;
      });

      assert.isOk( success );
    });
    
    it("В контексте { a: { b: { c: 777 }}} объявляем наблюдение за свойством 'a.b', в callback передается копия значения", () => {
      let data = { a: { b: { c: 777 }}};
      
      let dataContext = new DataContext({ data: data });

      let success = false;
      
      dataContext.observe( 'a.b', function( newValue ){
        assert.deepEqual( newValue, { c: 777 }, 'newValue must be deep equal to { c: 777 }' );
        assert.notEqual( newValue, data.a.b, 'newValue не равен по ссылке data.a.b');
        success = true;
      });
      
      assert.isOk( success );
    });
    
    it("В контексте { arr: [ { x: 123 }, { y: 456 }, { z: 789 } ] } объявляем наблюдение за свойством 'arr', в callback передается копия значения", () => {
      let data = { arr: [ { x: 123 }, { y: 456 }, { z: 789 } ] };
      
      let dataContext = new DataContext({ data: data });

      let success = false;
      
      dataContext.observe( 'arr', function( newValue ){
        let arr = data.arr;
        let arr2 = newValue;
        
        assert.deepEqual( arr2, [ { x: 123 }, { y: 456 }, { z: 789 } ], 'newValue must be deep equal to [ { x: 123 }, { y: 456 }, { z: 789 } ]' );
        
        assert.notEqual( arr2, arr );
        assert.notEqual( arr2[ 0 ], arr[ 0 ], 'ссылки должны быть разные' );
        assert.notEqual( arr2[ 1 ], arr[ 1 ], 'ссылки должны быть разные' );
        assert.notEqual( arr2[ 2 ], arr[ 2 ], 'ссылки должны быть разные' );
        
        success = true;
      });

      assert.isOk( success );
    });
    
  });
  
  describe("observe, get и set", () => {

    it("Объект-значение возвращаемый по пути '' такой же как устанавленный, но ссылки все разные", () => {
      
      let dataContext = new DataContext({ data: { x: 123 } });
      
      let newValue = { a: { b: { c: 777 } } };

      dataContext.set( '', newValue );
      
      let newValue2 = dataContext.get( '' );
      
      assert.deepEqual( newValue2, { a: { b: { c: 777 } } } );
      assert.notEqual( newValue2, newValue, 'ссылки должны быть разные' );
      assert.notEqual( newValue2.a, newValue.a, 'ссылки должны быть разные' );
      assert.notEqual( newValue2.a.b, newValue.a.b, 'ссылки должны быть разные' );
      assert.equal( newValue2.a.b.c, newValue.a.b.c );
    });
  });
});

describe("isValidVarName( varName )", () => {
  it(" ( undefined ) => ReferenceError( 'varName' )", () => {
    assert.throws( () => { isValidVarName( undefined ); }, ReferenceError, 'varName' );
  });
  
  it(" ( null ) => ReferenceError( 'varName' )", () => {
    assert.throws( () => { isValidVarName( null ); }, ReferenceError, 'varName' );
  });
  
  it(" ( {} ) => TypeError( 'varName must be string' )", () => {
    assert.throws( () => { isValidVarName( {} ); }, TypeError, 'varName' );
  });
  
  it(" ( '_' ) => true", () => {
    let isValid = isValidVarName( '_' );
    
    assert.isOk( isValid );
  });
  
  it(" ( '$' ) => true", () => {
    let isValid = isValidVarName( '$' );
    
    assert.isOk( isValid );
  });
    
  it(" ( 'v12' ) => true", () => {
    let isValid = isValidVarName( 'v12' );
    
    assert.isOk( isValid );
  });
  
  it(" ( '_12' ) => true", () => {
    let isValid = isValidVarName( '_12' );
    
    assert.isOk( isValid );
  });
  
  it(" ( '$12' ) => true", () => {
    let isValid = isValidVarName( '$12' );
    
    assert.isOk( isValid );
  });
  
  it(" ( '$_123_$' ) => true", () => {
    let isValid = isValidVarName( '$_123_$' );
    
    assert.isOk( isValid );
  });
  
  it(" ( '' ) => false", () => {
    let isValid = isValidVarName( '' );
    
    assert.isNotOk( isValid );
  });
  
  it(" ( '12' ) => false", () => {
    let isValid = isValidVarName( '12' );
    
    assert.isNotOk( isValid );
  });
  
  it(" ( '12v' ) => false", () => {
    let isValid = isValidVarName( '12v' );
    
    assert.isNotOk( isValid );
  });
  
  it(" ( '*' ) => false", () => {
    let isValid = isValidVarName( '*' );
    
    assert.isNotOk( isValid );
  });
  
  it(" ( '*v' ) => false", () => {
    let isValid = isValidVarName( '*v' );
    
    assert.isNotOk( isValid );
  });
  
  it(" ( 'v*' ) => false", () => {
    let isValid = isValidVarName( 'v*' );
    
    assert.isNotOk( isValid );
  });
  
  it(" ( 'v**' ) => false", () => {
    let isValid = isValidVarName( 'v**' );
    
    assert.isNotOk( isValid );
  });
  
  it(" ( '&' ) => false", () => {
    let isValid = isValidVarName( '&' );
    
    assert.isNotOk( isValid );
  });
  
  it(" ( '&v' ) => false", () => {
    let isValid = isValidVarName( '&v' );
    
    assert.isNotOk( isValid );
  });
  
  it(" ( 'v&' ) => false", () => {
    let isValid = isValidVarName( 'v&' );
    
    assert.isNotOk( isValid );
  });
  
  it(" ( 'v&&' ) => false", () => {
    let isValid = isValidVarName( 'v&&' );
    
    assert.isNotOk( isValid );
  });  
});

describe("Валидность keypath по /^[a-zA-Z_$][a-zA-Z0-9_$]*(\.([a-zA-Z_$][a-zA-Z0-9_$]*|\d+))*$/", () => {
  let regexp = /^[a-zA-Z_$][a-zA-Z0-9_$]*(\.([a-zA-Z_$][a-zA-Z0-9_$]*|\d+))*$/;
  
  let arr = [
    [ 'a', true ],
    [ 'a.b', true ],
    [ 'a.7.c', true ],
    [ 'a.b.7', true ],
    [ 'a.b7.c', true ],
    [ 'a.b.c7', true ],
    [ 'a7.b.c', true ],
    
    
    [ '', false ],
    [ 'a.', false ],
    [ '.a', false ],
    [ '.a.', false ],
    [ '.a.b', false ],
    [ 'a..b', false ],
    [ 'a*', false ],
    [ 'a.*', false ],
    [ 'a.*.b', false ],
    [ '7.b', false ],
    [ '7a.b', false ],
    
  ];
  
  for( let i = 0; i < arr.length; i++ ){    
    let keypath = arr[ i ][ 0 ]; 
    let expected = arr[ i ][ 1 ];
    
    it("'" + keypath + "' => " + expected, () => {
      let actual = regexp.test( keypath );
      assert.strictEqual( actual, expected );
    });
  }
});

describe("Базовые 'query path'", () => {
  let regexp = /^(\.{0,3}([a-zA-Z_$][a-zA-Z0-9_$]*|\*))(\.{1,3}([a-zA-Z_$][a-zA-Z0-9_$]*|\d+|\*))*$/;
  let a = [ 'a', '*', '' ];
  let b = [ 'b', '*' ];

  let dots =  [ '.', '..', '...' ];
  
  for( let i1 = 0; i1 < a.length; i1++ ){
    for( let i2 = 0; i2 < dots.length; i2++ ){
      for( let i3 = 0; i3 < b.length; i3++ ){
        let keypath = a[ i1 ] + dots[ i2 ] + b[ i3 ];
        it("'" + keypath + "' => true", () => {
          let actual = regexp.test( keypath );
          assert.strictEqual( actual, true );
        });
      }
    }
  }
  /*
  for( let j1 = 0; j1 < a.length; j1++ ){
    for( let j2 = 0; j2 < dots.length; j2++ ){
      let keypath = a[ j1 ] + dots[ j2 ];
      it("'" + keypath + "' => false", () => {
        let actual = regexp.test( keypath );
        assert.strictEqual( actual, false );
      });
    }
  }*/
});

describe("KeyPath", () => {
  describe("Правильные базовые keypath", () => {
    let arr = [ '', '.', 'a', 'a.b', 'a.7', 'a.b7', 'a7', 'a.b.c', 'a.b.c7', 'a.b.7' ];
    
    for( let i = 0; i < arr.length; i++ ){
      it("'" + arr[ i ] + "' => true", () => {
        let isValid = KeyPath.isValid( arr[ i ] );
        assert.isOk( isValid );
      });
    }
  });
  
  describe("Не правильные базовые keypath", () => {
    let arr = [
      '..', '...', '7', '7a', '7.b', '.a', '..a', '...a',
      '.a.', 'a.', 'a..', 'a...', '*.a', 'a.*', '*'
    ];
    
    for( let i = 0; i < arr.length; i++ ){
      it("'" + arr[ i ] + "' => false", () => {
        let isValid = KeyPath.isValid( arr[ i ] );
        assert.isNotOk( isValid );
      });
    }
  });
});

describe("QueryPath", () => {
  
  describe("Правильные 'query path'", () => {
    let a = [ 'a', '*', '' ];
    let b = [ 'b', '*' ];
    let dots =  [ '.', '..', '...' ];
    
    let arr = [ '', '.', '*', 'a' ];
    
    for( let i1 = 0; i1 < a.length; i1++ ){
      for( let i2 = 0; i2 < dots.length; i2++ ){
        for( let i3 = 0; i3 < b.length; i3++ ){
          let queryPath = a[ i1 ] + dots[ i2 ] + b[ i3 ];
          arr.push( queryPath );
        }
      }
    }
    
    for( let i = 0; i < arr.length; i++ ){
      let orderNo = i + 1;
      it(orderNo + ") '" + arr[ i ] + "'", () => {
        let isValid = QueryPath.isValid( arr[ i ] );
        assert.isOk( isValid );
      });
    }
  });
  
  describe("Не правильные 'query path'", () => {
    let arr = [ 'a.' ,'a..', 'a...', '*.', '*..', '*...', '..', '...', 'a.**.b', '*a', 'a*' ];
    
    for( let i = 0; i < arr.length; i++ ){
      let orderNo = i + 1;
      it(orderNo + ") '" + arr[ i ] + "'", () => {
        let isValid = QueryPath.isValid( arr[ i ] );
        assert.isNotOk( isValid );
      });
    }
    
  });
  
  describe("match( queryPath, keyPath )", () => {
    let arr = [
      [ '', '', true ],
      [ '', '.', true ],
      [ '.', '', true ],
      [ '.', '.', true ],
      
      [ '*', 'a', true ],      
      [ '*.b', 'a.b', true ],
      [ '*.*.c', 'a.b.c', true ],
      [ 'a.*', 'a.b', true ],
      [ 'a.*.*', 'a.b.c', true ],
      [ '*.b.*', 'a.b.c', true ],
      
      [ '..a', 'a', true ],
      [ '..b', 'a.b', true ],
      [ '..c', 'a.b.c', true ],
      [ 'a..b', 'a.b', true ],
      [ 'a..c', 'a.b.c', true ],
      [ 'a..b..e..g', 'a.b.c.d.e.f.g', true ],
      [ 'a..f', 'a.b.c.d.e.f', true ],
      [ '..*', 'a', true ],
      [ '..*', 'a.b', true ],
      [ '..*', 'a.b.c', true ],
      [ '..*.a', 'a', false ],
      [ '..*.b', 'a.b', true ],
      [ '..*.c', 'a.b.c', true ],
      [ '..*.b.*', 'a.b.c', true ],
      [ 'a..*.c.*', 'a.b.c.d', true ],
      [ '*..b', 'a.b', true ],
      [ '*..c', 'a.b.c', true ],
      
      [ '...a', 'a', false ],
      [ '...b', 'a.b', true ],
      [ '...c', 'a.b.c', true ],
      [ 'a...b', 'a.b', false ],
      [ 'a...c', 'a.b.c', true ],
      [ 'a...c...e', 'a.b.c.d.e', true ],
      [ 'a...b...e...g', 'a.b.c.d.e.f.g', false ],
      [ 'a...f', 'a.b.c.d.e.f', true ],
      [ '...*', 'a', false ],
      [ '...*', 'a.b', true ],
      [ '...*', 'a.b.c', true ],
      [ '...*.a', 'a', false ],
      [ '...*.b', 'a.b', false ],
      [ '...*.c', 'a.b.c', true ],
      [ '...*.b.*', 'a.b.c', false ],
      [ 'a...*.c.*', 'a.b.c.d', false ],      
      [ 'a...d.*..g', 'a.b.c.d.e.f.g', true ],
    ];
    
    for( let i = 0; i < arr.length; i++ ){
      let queryPath = arr[ i ][ 0 ];
      let keyPath = arr[ i ][ 1 ];
      let expected = arr[ i ][ 2 ];
      
      it("( '" + queryPath + "', '" + keyPath + "' ) => " + expected, () => {
        let actual = QueryPath.match( queryPath, keyPath );
        assert.strictEqual( actual, expected );
      });
    }
  });
});