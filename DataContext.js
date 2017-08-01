////////////////////////////////////////////////////////////////////////
//                           Stack - не готов
////////////////////////////////////////////////////////////////////////

function Stack() {
  this.arr = [];
};

Stack.prototype.push = function( item ) {
  this.arr.push( item );
  
  return this;
};

Stack.prototype.peek = function() {
  let n = this.arr.length;
  
  return n > 0 ? this.arr[ n - 1 ] : undefined;
};

Stack.prototype.pop = function() {
  return this.arr.pop();
};

Stack.prototype.getLength = function() {
  return this.arr.length;
};

Stack.prototype.clear = function() {
  this.arr = [];
  
  return this;
};

Stack.prototype.clone = function() {
//-----
};

Stack.prototype.toArray = function() {
  let n = this.arr.length;
  
  let newArr = new Array( n );
  
  let i = 0;
  while( n-- ) {
    newArr[ i ] = this.arr[ n ];
    i++;
  }
  
  return newArr;
};

////////////////////////////////////////////////////////////////////////
//                           Queue - не готов
////////////////////////////////////////////////////////////////////////

function Queue() {
  this.arr = [];
};

Queue.prototype.enqueue = function( item ) {
  this.arr.push( item );
  
  return this;
};

Queue.prototype.dequeue = function() {
  return this.arr.shift();
};

Queue.prototype.peek = function() { 
  return this.arr.length > 0 ? this.arr[ 0 ] : undefined;
};

Queue.prototype.getLength = function() {
  return this.arr.length;
};

Queue.prototype.clear = function() {
  this.arr = [];
  
  return this;
};

Queue.prototype.clone = function() {
  
  let queue = new Queue();
  
  queue.arr = _.clone( this.arr );
  
  return queue;
};

Stack.prototype.toArray = function() {  
  return _.clone( this.arr );
};

Stack.prototype.contains = function( item ) { 
  return this.arr.some( itemArr => itemArr === item );
};

Stack.prototype.isEmpty = function() { 
  return this.arr.length == 0;
};


/*
function setValue( context, keypath, value ){
  
  if( context == null ){
    throw new ReferenceError( 'context' );
  }
  
  if( $.type( context ) != 'object' && $.type( context ) != 'array' ){
    throw new TypeError( 'context must be type of object or array' );
  }
};
*/

/* нужно на будущее чтобы проверять имена свойств state'а */
function isValidVarName( varName ){
  if( varName == null ){
    throw new ReferenceError( 'varName' );
  }
  
  if( $.type( varName ) !== 'string' ){
    throw new TypeError( 'varName must be string' );
  }

  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test( varName );
};


let QueryPath = {
  isValid: function( queryPath ){
    if( queryPath == null ){
      throw new ReferenceError( 'queryPath' );
    }
    
    if( $.type( queryPath ) !== 'string' ){
      throw new TypeError( 'queryPath: must has type of string' );
    }
    
    if( queryPath === '' || queryPath === '.' ){
      return true;
    }
    
    let regexp = /^(\.{0,3}([a-zA-Z_$][a-zA-Z0-9_$]*|\*))(\.{1,3}([a-zA-Z_$][a-zA-Z0-9_$]*|\d+|\*))*$/;
    
    let isValid = regexp.test( queryPath );
    
    return isValid;
  },

  _makeRegExp: function( queryPath ){
    let isValid = QueryPath.isValid( queryPath );
    
    if( !isValid ){
      throw new Error( 'queryPath: is not valid' );
    }
    
    let pattern = queryPath;
    
    pattern = pattern.replace( /^\*/, '@1' );
    pattern = pattern.replace( /\*/g, '@2' );
    pattern = pattern.replace( /^\.\.\./, '@3' );
    pattern = pattern.replace( /\.\.\./g, '@4' );
    pattern = pattern.replace( /^\.\./, '@5' );
    pattern = pattern.replace( /\.\./g, '@6' );
     
    /* заменяем звездочку (*) в начале строки */
    pattern = pattern.replace( /@1/, '[a-zA-Z_$][a-zA-Z0-9_$]*' );
    
    /* заменяем звездочку (*) в остальной части строки */
    pattern = pattern.replace( /@2/g, '([a-zA-Z_$][a-zA-Z0-9_$]*|\\d+)' );
    
    /* заменяем (...) в начале строки */
    pattern = pattern.replace( /@3/, '([a-zA-Z_$][a-zA-Z0-9_$]*(\\.([a-zA-Z_$][a-zA-Z0-9_$]*|\\d+))*\\.)' );
    
    /* заменяем (...) в остальной части строки */
    pattern = pattern.replace( /@4/g, '(\\.([a-zA-Z_$][a-zA-Z0-9_$]*|\\d+))+\\.' );
    
    /* заменяем (..) в начале строки */
    pattern = pattern.replace( /@5/, '([a-zA-Z_$][a-zA-Z0-9_$]*(\\.([a-zA-Z_$][a-zA-Z0-9_$]*|\\d+))*\\.)?' );
    
    /* заменяем (..) в остальной части строки */
    pattern = pattern.replace( /@6/g, '(\\.|((\\.([a-zA-Z_$][a-zA-Z0-9_$]*|\\d+))+\\.))' );
    
    pattern = '^' + pattern + '$';
    
    return new RegExp( pattern );
  },
  
  match: function( queryPath, keyPath ){
    let queryPathIsValid = QueryPath.isValid( queryPath );
    if( !queryPathIsValid ){
      throw new Error( 'queryPath: is not valid' );
    }   
    
    
    let keyPathIsValid = KeyPath.isValid( keyPath );
    if( !keyPathIsValid ){
      throw new Error( 'keyPath: is not valid' );
    }
    
    //--------------------------------------------------
    
    if( queryPath === '' && keyPath === '.' ){
      return true;
    }
    
    if( queryPath === '.' && keyPath === '' ){
      return true;
    }
    
    let regexp = QueryPath._makeRegExp( queryPath );
    
    return regexp.test( keyPath );
  }
};

let KeyPath = {
  isValid: function( keyPath ) {
    if( keyPath == null ){
      throw new ReferenceError( 'keyPath' );
    }
    
    if( $.type( keyPath ) !== 'string' ){
      throw new TypeError( 'keyPath: must has type of string' );
    }
    
    if( keyPath === '' || keyPath === '.' ){
      return true;
    }
    
    let regexp = /^[a-zA-Z_$][a-zA-Z0-9_$]*(\.([a-zA-Z_$][a-zA-Z0-9_$]*|\d+))*$/;
    
    let isValid = regexp.test( keyPath );
    
    return isValid;
  }
};

function getTypePath( inputString ) {
  if( /^[a-zA-Z_$][a-zA-Z0-9_$]*(\.([a-zA-Z_$][a-zA-Z0-9_$]*|\d+))*$/.test( inputString )) return 'keypath';
  
  if( /^(\.{0,3}([a-zA-Z_$][a-zA-Z0-9_$]*|\*))(\.{1,3}([a-zA-Z_$][a-zA-Z0-9_$]*|\d+|\*))*$/.test( inputString )) return 'querypath';
  
  throw new Error( 'inputString: can not define type of path' );
};

/*
direction: (forward, backward)
*/
/*
{ a: { x: 123 }, b: { y: 456 },c: { z: 789 }}
dfsIterator({ a: { x: 123 }, b: { y: 456 },c: { z: 789 }}, (key, kp) => console.log(kp), '<');

keys, key, keypath, value, obj
*/
function dfsIterator2( obj, callback, direction ) {
  if( !isComplexType( obj )) throw new TypeError( 'obj' );
  direction = direction || '>';

  let stack = [];

  let queue = [];

  _.keys( obj ).sort().reverse().forEach((key) => {
    stack.push({ key: key, keypath: key, value: obj[key], ctx: obj });
  });

  while(stack.length > 0) {
    let item = stack.pop();

    if( direction == '>' ) {
      if( callback(item.key, item.keypath, item.value, item.ctx) === false ) return;
    }

    if(isComplexType( item.value )) {
      let ctx = item.value;
      _.keys( ctx ).sort().reverse().forEach((key) => { stack.push({ key: key, keypath: item.keypath + '.' + key, value: ctx[key], ctx: ctx }); });
    }

    if(direction == '<') {
      queue.push(item);
    }
  }

  if(direction == '<') {
      while(queue.length > 0) {
        let item = queue.shift();
        if( callback(item.key, item.keypath, item.value, item.ctx) === false ) return;
      }
    }
};

function dfsIterator( obj, callback, direction ) {
  if( !isComplexType( obj )) throw new TypeError( 'obj' );
  direction = direction || '>';
  parentKeypath = '';

  _dfsIterator( obj, callback, direction, parentKeypath );
};

function _dfsIterator( obj, callback, direction, parentKeypath ) {
  //if( !isComplexType( obj )) throw new TypeError( 'obj' );
  //direction = direction || '>';
  //parentKeypath = parentKeypath || '';

  let keys =  _.keys( obj ).sort();

  for(let i = 0, n = keys.length; i < n; i++) {
    let key = keys[ i ];
    let value = obj[ key ];
    let keypath = parentKeypath == '' ? key : parentKeypath + '.' + key;

    if( direction == '>' ) {
      if( callback( key, keypath, value, obj ) === false ) return;
    }

    if( isComplexType( value )) {      
      _dfsIterator( value, callback, direction, keypath );      
    }

    if( direction == '<' ) {
      if( callback( key, keypath, value, obj ) === false ) return;
    }
  }
};

function bfsIterator(obj, callback, direction) {
  if( !isComplexType( obj )) throw new TypeError( 'obj' );
  direction = direction || '>';

  if(direction == '>') _bfsIteratorForward( obj, callback );

  if(direction == '<') _bfsIteratorBackward( obj, callback );
};

function _bfsIteratorForward( obj, callback ) {  
  let queue = [];
  
  _.keys( obj ).sort().forEach( key => queue.push({ key: key, keypath: key, value: obj[ key ], ctx: obj }));
  
  while( queue.length > 0 ) {
    let item = queue.shift();

    if( callback( item.key, item.keypath, item.value, item.ctx ) === false ) return;
    
    if( isComplexType( item.value )) {
      let ctx = item.value;
      _.keys( ctx ).sort().forEach( key => queue.push({ 
        key: key, 
        keypath: item.keypath + '.' + key, 
        value: ctx[ key ], 
        ctx: ctx
      }));
    }
  }
};

function _bfsIteratorBackward( obj, callback ) {
  
  if( !isComplexType( obj ) ) throw new TypeError( 'obj' );
  
  let queue = [];
  
  let levels = [];
  
  _.keys( obj ).sort().forEach( key => queue.push({ key: key, keypath: key, value: obj[ key ], ctx: obj, level: 0 }));
  
  while( queue.length > 0 ) {
    let item = queue.shift();
    
    if(( levels.length - 1) < item.level ) {
      levels.push([]); //queue
    }
    
    levels[ item.level ].push( item );
    
    if( isComplexType( item.value )) {
      let ctx = item.value;
      _.keys( ctx ).sort().forEach( key => queue.push({ 
        key: key, 
        keypath: item.keypath + '.' + key, 
        value: ctx[ key ], 
        ctx: ctx, 
        level: item.level + 1 
      }));
    }
  }
  
  let i = levels.length;
  while( i-- ) {
    let q = levels[ i ];
    
    while( q.length > 0 ) {
      let item = q.shift();
      if( callback( item.key, item.keypath, item.value, item.ctx ) === false ) return;
    }
  }
};

/*
bfsIterator({ a: { a2: 2, a3: 3, a1: 1 }, b: { b1: 1, b3: 3, b2: 2 }}, ( key, keypath ) => console.log( key + ': ' + keypath ));
*/
// query: '..x'
function skipFinder(obj, query) {
  let searchKey = query.replace(/^\.\./, '');

  let retVal = null;

  bfsIterator(obj, (key, keypath, value, ctx) => {
    if(key === searchKey) {
      retVal = {
        key: key,
        keypath: keypath,
        value: value,
        context: ctx
      };

      return false;
    }
  });

  return retVal;
};

// query: '..x'
function deepFinder(obj, query) {

};

/*
obj = {b:{x: 123},a:{x: 456}};
.
skipFinder({b:{x: 123},a:{x: 456}}, '..x'); 
*/

function keypathIterator( obj, rootKeypath, callback ) {
  rootKeypath = rootKeypath || '';
  
  if( !isComplexType( obj ) ) throw new TypeError( 'obj' );
  
  let keys = Object.keys( obj );
  
  keys.forEach(( key ) => {
    let value = obj[ key ];    
    let keypath = rootKeypath ? rootKeypath + '.' + key : key;
    
    callback( key, keypath, value, obj );
    
    if( !isComplexType( value ) ) return;
    
    keypathIterator( value, keypath, callback );
  });
};

/* notifier: ( key, keypath, oldValue, newValue, action ) */
function diffIterator( objA, objB, notifier, rootKeypath ) {
  rootKeypath = rootKeypath || '';
  
  let isDifferent = false;
  
  if( objA === objB ) return isDifferent;
  
  let keysA = Object.keys( objA );
  let keysB = Object.keys( objB );
  
  let removedKeys = _.difference( keysA, keysB );
  let addedKeys = _.difference( keysB, keysA );
  let intersectionKeys = _.intersection( keysA, keysB );  
  
  let removeNotifier = ( key, keypath, value ) => { 
    notifier( key, keypath, value, undefined, 'remove' ); 
    isDifferent = true;
  };

  let addNotifier = ( key, keypath, value ) => {
    notifier( key, keypath, undefined, value, 'add' );
    isDifferent = true;
  };
  
  let makeKeypath = ( key ) => rootKeypath ? rootKeypath + '.' + key : key;
  
  removedKeys.forEach(( key ) => {
    let keypath = makeKeypath( key );
    let oldValue = objA[ key ];
    removeNotifier( key, keypath, oldValue );
    
    if( !isComplexType( oldValue )) return;
    
    keypathIterator( oldValue, keypath, removeNotifier );
  });
  
  addedKeys.forEach(( key ) => {
    let keypath = makeKeypath( key );
    let newValue = objB[ key ];      
    addNotifier( key, keypath, newValue );
    
    if( !isComplexType( newValue )) return;
    
    keypathIterator( newValue, keypath, addNotifier );
  });
  
  intersectionKeys = intersectionKeys.filter(( key ) => objA[ key ] !== objB[ key ] );
  
  intersectionKeys.forEach(( key ) => {
    let keypath = makeKeypath( key );
    let oldValue = objA[ key ];
    let newValue = objB[ key ];    
    
    if( isObjects( oldValue, newValue ) || isArrays( oldValue, newValue )) {
      let isDifferentInner = diffIterator( oldValue, newValue, notifier, keypath );
      
      if( isDifferentInner ) {
        isDifferent = true;
        notifier( key, keypath, oldValue, newValue, 'change' );
      }      
    }
    else if( isSimpleType( oldValue ) && isSimpleType( newValue )) {
      notifier( key, keypath, oldValue, newValue, 'change' );
    } 
    else if( isComplexType( oldValue ) && isSimpleType( newValue )) {
      keypathIterator( oldValue, keypath, removeNotifier );
      notifier( key, keypath, oldValue, newValue, 'change' );
    }
    else if( isSimpleType( oldValue ) && isComplexType( newValue )) {
      keypathIterator( newValue, keypath, addNotifier );
      notifier( key, keypath, oldValue, newValue, 'change' );
    }    
    else if( isObjectAndArray( oldValue, newValue ) || isArrayAndObject( oldValue, newValue )) {      
      keypathIterator( oldValue, keypath, removeNotifier );
      keypathIterator( newValue, keypath, addNotifier );
      notifier( key, keypath, oldValue, newValue, 'change' );
    }
    else {
      throw new Error( 'Непредвиденная ситуация' );
    }
    
    return isDifferent;
  });
};

function diffStates( stateA, stateB ) {
  let removed = [];
  let changed = [];
  let added = [];
  
  diffIterator( stateA, stateB, ( key, keypath, oldValue, newValue, action ) => {
    let item = {
      action: action,
      keypath: keypath,
      oldValue: oldValue,
      newValue: newValue
    };
    
    if( action == 'remove' ) removed.push( item );
    if( action == 'change' ) changed.push( item );
    if( action == 'add' ) added.push( item );
  });
  
  let results = _.concat( removed, changed, added );
  
  return results;
};

function isSimpleType( arg ) {
  let t = $.type( arg );
  
  return t == 'date' 
    || t == 'regexp' 
    || t == 'string' 
    || t == 'undefined' 
    || t == 'null' 
    || t == 'function' 
    || t == 'number' 
    || t == 'boolean';
};

function isComplexType( arg ) {  
  return isObject( arg ) || isArray( arg );
};

function isObject( arg ) {
  //return $.type( arg ) == 'object';
  return _.isPlainObject( arg );
};

function isArray( arg ) {
  return $.type( arg ) == 'array';
};

function isObjects( arg1, arg2 ) {
  return isObject( arg1 ) && isObject( arg2 );
};

function isArrays( arg1, arg2 ) {
  return isArray( arg1 ) && isArray( arg2 );
};

function isObjectAndArray( arg1, arg2 ) {
  return $isObject( arg1 ) && isArray( arg2 );
};

function isArrayAndObject( arg1, arg2 ) {
  return isArray( arg1 )  && isObject( arg2 );
};

function setValue( obj, keypath, value ){ 
  let ctx = _.clone( obj );
  
  let keys = keypath.split( '.' );
  
  let _isDigitKey = ( strArg ) => /^\d+$/.test( strArg );
  let _nextKeyIsIndex = () => _isDigitKey( keys[ 0 ] );

  let _isLastKey = () => keys.length == 0;
  
  while( keys.length > 0 ) {
    let key = keys.shift();
    let val = ctx[ key ];
    let type = $.type( val );
    
    if( _isLastKey( key )) {
      if( value === undefined ) {
        delete ctx[ key ];
      }
      else { ctx[ key ] = value; }
      return ctx;
    }   
    
    if( isSimpleType( val )) {
      ctx[ key ] = {};
      ctx = ctx[ key ];
      continue;
    }
    
    if( isObject( val )) {
      ctx[ key ] = _.clone( val );
      ctx = ctx[ key ];
      continue;
    }
    
    if( isArray( val ) && _nextKeyIsIndex() ) {
      let index = parseInt( keys[ 0 ] );
      
      if( index >= val.length ) {
        let newLength = index + 1;
        while( val.length < newLength ) val.push( null );
      }
      
      ctx[ key ] = _.clone( val );
      ctx = ctx[ key ];
      continue;
    }
    
    if( isArray( val ) && !_nextKeyIsIndex() ) {
      ctx[ key ] = {};
      ctx = ctx[ key ];
      continue;
    }
  }
    
  return ctx;
};

function keypaths( obj, key, keypath ) {
  key = key || '';
  let nextKeypath = keypath ? _.join([ keypath, key ], '.' ) : key;
  
  return !_.isObjectLike( obj )
    ? nextKeypath 
    : _.chain( obj ).keys( obj ).map( k => keypaths( obj[k], k, nextKeypath )).flatten().value();
}
  
////////////////////////////////////////////////////////////////////////
//                           CalcRules
////////////////////////////////////////////////////////////////////////

function CalcRules() {
  this.calcRuleList = [];
};

CalcRules.prototype.add = function( targetQuery, sourceQueries, func ) {

  if( this.has( targetQuery )) throw new Error( 'Правило уже существует для targetQuery: ' + targetQuery );
      
  let calcRule = new CalcRule( this, targetQuery, sourceQueries, func );
      
  this.calcRuleList.push( calcRule );

  return calcRule;
};

CalcRules.prototype.remove = function( targetQuery ) {
  this.calcRuleList = _.remove( this.calcRuleList, calcRule => calcRule.targetQuery == targetQuery );
};

CalcRules.prototype.has = function( targetQuery ) {
  return this.calcRuleList.some(( calcRule ) => calcRule.targetQuery == targetQuery );
};

CalcRules.prototype.find = function( keypath ) {
  
  let calcRule = null;
  
  for( let i = 0, n = this.calcRuleList.length; i < n; i++ ) {    
    let calcRuleItem = this.calcRuleList[ i ];
    
    if( !QueryPath.match( keypath, calcRuleItem.targetQuery )) continue;

    if( calcRule == null ) {
      calcRule = calcRuleItem;
    }
    else if( this.moreSpecific( calcRuleItem, calcRule )) 
    {
      calcRule = calcRuleItem;
    }
  }
  
  return calcRule;
};

CalcRules.prototype.moreSpecific = function( calcRuleA, calcRuleB ) {

  let specificTypeA = getTypePath( calcRuleA.targetQuery ) == 'keypath' ? 2 : 1;
  let specificTypeB = getTypePath( calcRuleB.targetQuery ) == 'keypath' ? 2 : 1;
  
  if( specificTypeA > specificTypeB ) return true;
  if( specificTypeA < specificTypeB ) return false;
  
  let indexA = _.findIndex( this.calcRuleList, calcRule => calcRule.targetQuery == calcRuleA.targetQuery );
  let indexB = _.findIndex( this.calcRuleList, calcRule => calcRule.targetQuery == calcRuleB.targetQuery );
  
  // проверка на корректность
  if( indexA < 0 || indexB < 0 ) throw new Error( 'Ошибка индекс не может быть меньше нуля' );
  
  if( indexA > indexB ) return true;
  if( indexA < indexB ) return false;
  
  throw new Error( 'Этот код не должен выполняться' );
};

////////////////////////////////////////////////////////////////////////
//                           CalcRule
////////////////////////////////////////////////////////////////////////

function CalcRule( calcRules, targetQuery, sourceQueries, func ) {
  this.calcRules = calcRules;
  this.targetQuery = targetQuery;
  this.sourceQueries = sourceQueries;
  this.func = func;
};

CalcRule.prototype.match = function( keypath ) {
  return QueryPath.match( this.targetQuery, keypath );
};

CalcRule.prototype.isKeypath = function() {
  return getTypePath( this.targetQuery ) == 'keypath'
};

////////////////////////////////////////////////////////////////////////
//                           Target
////////////////////////////////////////////////////////////////////////

function Target( keypath, calcRule ) {

  this.keypath = keypath;
  
  this.calcRule = calcRule;
  
  this.sourceQueries = calcRule.sourceQueries.map(( sourceQuery ) => this.convertSourceRelativeQuery( keypath, sourceQuery ));
};

Target.prototype.sourceAffects = function( keypath ) {
  return this.sourceQueries.some( sourceQuery => QueryPath.match( sourceQuery, keypath ));
};

Target.prototype.calcValue = function( dataContext, state ) {
  let argValues = [];
  
  this.sourceQueries.forEach( sourceQuery  => argValues.push( undefined ));
  
  this.sourceQueries.forEach(( sourceQuery, i )  => {
    keypathIterator( state, '', ( key, keypath, value ) => {
      if( !QueryPath.match( sourceQuery, keypath )) return;
      
      if( getTypePath( sourceQuery ) == 'querypath' ) {
        argValues[ i ] = argValues[ i ] || [];
        argValues[ i ].push( value );
      }
      else {
        argValues[ i ] = value;
      }
    });
  });
  
  return this.calcRule.func.apply( dataContext, argValues );
};

Target.prototype.convertSourceRelativeQuery = function( keypath, sourceQuery ) {
  let keys = keypath.split( '.' );
    
  let parentPath = '';
    
  if( keys.length > 1 ) {
    keys = keys.slice( 0, keys.length - 1 );
    
    parentPath = keys.join( '.' ) + '.';
  }
  
  return sourceQuery.replace( '~.', parentPath );
};

////////////////////////////////////////////////////////////////////////
//                           DataContext
////////////////////////////////////////////////////////////////////////

function DataContext( initState ) {
  this.currentState = initState;
  
  this.calcRules = new CalcRules();
  this.observes = [];
  
  this.targetList = [];
  
  // граф
  //this.vertList = [];
  //this.adjList = [];
  
  this.actualSet = new Set();
  this.noActualSet = new Set();
};
  
DataContext.prototype.calc = function( targetQuery, sourceQueries, func ) {

  let calcRule = this.calcRules.add( targetQuery, sourceQueries, func );
  
  let targetNewList = null;
  
  if( calcRule.isKeypath() ) {
    targetNewList = [ new Target( targetQuery, calcRule ) ];
  }
  else {
    let keypathList = this.selectKeypathsBy( this.currentState, calcRule.targetQuery );
  
    targetNewList = keypathList.map( keypath => new Target( keypath, calcRule ));
  }

  this.addTargetNewList( targetNewList );
  
  this.calculate();
};

DataContext.prototype.addTargetNewList = function( targetNewList ) {

  if( targetNewList.length == 0 ) return;
  
  let i = this.targetList.length;
  
  while( i-- ) {
    let targetItem = this.targetList[ i ];
    
    let targetNew = _.find( targetNewList, targetNewItem => targetNewItem.keypath == targetItem.keypath );
    
    if( targetNew == null ) continue;
    
    if( this.calcRules.moreSpecific( targetItem.calcRule, targetNew.calcRule )) {
      targetNewList = _.remove( targetNewList, targetNewItem => targetNewItem == targetNew );
    }
    else {
      this.targetList = _.remove( this.targetList, targetItemRemove => targetItemRemove == targetItem );
      this.actualSet.delete( targetItem.keypath );
      this.noActualSet.delete( targetItem.keypath );
    }
  }
  
  i = this.targetList.length;
  
  while( i-- ) {
    let targetItem = this.targetList[ i ];
    
    if( targetNewList.some( targetNewItem => targetItem.sourceAffects( targetNewItem.keypath ))){
      this.actualSet.delete( targetItem.keypath);
      this.noActualSet.add( targetItem.keypath );
    }
  }
  
  targetNewList.forEach( targetNewItem => this.noActualSet.add( targetNewItem.keypath ));
  
  this.targetList = this.targetList.concat( targetNewList );
};

DataContext.prototype.calculate = function() {    
  
  let prevState = this.currentState;
  
  this.calcTargets();
  
  let nextState = this.currentState;
  
  this.runObservers( prevState, nextState );
};

DataContext.prototype.runObservers = function( prevState, nextState ) {
  diffIterator( prevState, nextState, ( key, keypath, oldValue, newValue, action ) => {
   
    for( let i = 0, n = this.observes.length; i < n; i++ ) {
      let observerItem = this.observes[ i ];
      
      if( !QueryPath.match( observerItem.querypath, keypath )) continue;
      
      observerItem.callback( newValue, oldValue, keypath );
    }
  });
};

DataContext.prototype.calcTargets = function() {   
  
  while( this.noActualSet.size > 0 ) {
    
    let calcKeypath = this.getNextCalcKeypath();
    
    if( calcKeypath == null ) throw new Error( 'Не найден путь для вычисления' );
    
    let calcTarget = _.find( this.targetList, targetItem => targetItem.keypath == calcKeypath );
    
    let targetValue = calcTarget.calcValue( this, this.currentState ); // рассчитываем значение
    
    let nextState = setValue( this.currentState, calcTarget.keypath, targetValue ); // получим новое состояние
          
    this.actualSet.add( calcKeypath );
    
    this.noActualSet.delete( calcKeypath );

    let changes = diffStates( this.currentState, nextState ); // получаем изменения состояний
    
    this.applyChanges( changes ); // вносим правки в структуру
    
    this.currentState = nextState;
  }
};

DataContext.prototype.applyChanges = function( changes ) {
  
  let i = this.targetList.length;
  
  while( i-- ) {
    let targetItem = this.targetList[ i ];
    
    for( let j = 0, m = changes.length; j < m; j++ ) {
      let changeItem = changes[ j ];        
      
      if( targetItem.keypath == changeItem.keypath ) {
        if( changeItem.action == 'remove' ) {
          if( targetItem.calcRule.isKeypath() ) {
            this.actualSet.delete( targetItem.keypath );
            this.noActualSet.add( targetItem.keypath );
          }
          else {
            _.remove( this.targetList, t => t == targetItem );
          }
        }
      }
      
      if( targetItem.sourceAffects( changeItem.keypath )) {
        this.actualSet.delete( targetItem.keypath );
        this.noActualSet.add( targetItem.keypath );
      }
      /*
      let targetNewList = [];
      
      if( changeItem.action == 'add' ){
        let calcRule = this.calcRules.find( changeItem.keypath );
        
        if( calcRule == null ) continue;
        
        let targetNew = new Target( changeItem.keypath, calcRule );
        
        targetNewList.push( targetNew);
      }
      
      this.addTargetNewList( targetNewList );
      */
    }      
  }
};

DataContext.prototype.getNextCalcKeypath = function() {
  
  for( let i = 0, n = this.targetList.length; i < n; i++ ) {
    let targetItem = this.targetList[ i ];
    
    if( this.actualSet.has( targetItem.keypath )) continue;
    
    let adjList = this.targetList.filter( t => t != targetItem && targetItem.sourceAffects( t.keypath ));
    
    if( adjList.length == 0 ) return targetItem.keypath;
    
    if( adjList.every( t => this.actualSet.has( t.keypath ) )) return targetItem.keypath;
  }
  
  return null;
};


DataContext.prototype.selectKeypathsBy = function( state, targetQuery ) {
  return keypaths( state ).filter( keypath => QueryPath.match( targetQuery, keypath ));
};

/* observe( querypath, callback[, options ]) */
DataContext.prototype.observe = function( querypath, callback, options ) {
  
  let opts = _.assign( { init: true, context: this }, options );
  
  let cb = callback.bind( opts.context );
  
  this.observes.push({ querypath: querypath, callback: cb });
  
  if( opts.init === true ) {
    this.calculate();

    let keypathList = keypaths( this.currentState ).filter( kp => QueryPath.match( querypath, kp ));
    
    for( let i = 0, len = keypathList.length; i < len; i++ ) {
      let keypathItem = keypathList[ i ];
      let newValue = _.get( this.currentState, keypathItem );
      let oldValue = undefined;
      
      cb( newValue, oldValue, keypathItem );
    }
  }
};

DataContext.prototype.get = function( keypath ) {
  
  if( keypath === '' || keypath === '.' ) return _.cloneDeep( this.currentState );
  
  let value = _.get( this.currentState, keypath );
  
  return _.cloneDeep( value );
};

DataContext.prototype.set = function( keypath, value ) {
  
  if( this.targetList.some( t => t.keypath == keypath )) return;
      
  let dirtyState = setValue( this.currentState, keypath, value );
  
  let changes = diffStates( this.currentState, dirtyState );
  
  this.applyChanges( changes );
  
  let prevState = this.currentState;
  
  this.currentState = dirtyState;
  
  this.calcTargets();
  
  let nextState = this.currentState;
  
  this.runObservers( prevState, nextState );

};

let state = { a: null, b: 3, c: null, x: 4, y: 8, z: null };

let ctx = new DataContext( state );

ctx.calc( 'a', [ 'x' ], x => x );

ctx.calc( 'z', [ 'x', 'y' ], ( x, y ) => x * y );

ctx.calc( '..c', [ '..a', '~.b' ], ( a, b ) => a[ 0 ] + b );

console.log( JSON.stringify( ctx.currentState ));
console.time('mark');
_.times( 1000, () => ctx.calculate());
console.timeEnd('mark');


