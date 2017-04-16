var CalcDb = (function() {
    
  function CalcDbClass() {
    
    this.targets = new Targets();
    
    this.targetCounter = new TargetCounter();
    
    this.sources = new Sources();
    
  };
  
  CalcDbClass.prototype.register = function( target, sourceInit, func, plainObject ) {
    
    this.targets.add( target );
    
    let targetIsKeypath = KeyPath.is( target );
    
    let targetIsQuerypath = QueryPath.is( target );
    
    if( !targetIsKeypath && !targetIsQuerypath ) throw new Error( 'target must be keypath or querypath' );
    
    if( targetIsKeypath ) {
    
      if( this.existsTargetKeypath( target ) ) throw new Error( "Target '" + target + "' has already been registered" );
      
      this.targets.maxId += 1;
      
      this.targets.list.push({ targetId: this.targets.maxId, target: target, func: func, targetType: 'keypath' });
      
      this.targets.keypaths.push({ targetId: this.targets.maxId, keypath: target });
    }
    else { /*targetIsQuerypath*/
            
      this.targets.list.forEach( ( itemTarget ) => { if( itemTarget == target ) throw new Error( target + ' уже объявлено' ); });
       
      let newKeypaths = filterByQueryPath( plainObject, target );
      
      let intersections = this._getIntersections( this.targets.keypaths, newKeypaths );
      
      if( intersections.length > 0 ) {
        console.log( 'intersections: ' + intersections.join() );
        throw new Error( 'target has intersections, console writed' );
      }
      
      //если новые пути не пересекаются, то добавляем их в коллекцию
      this.targets.maxId += 1;
      
      this.targets.list.push({ targetId: this.targets.maxId, target: target, func: func, targetType: 'querypath' } );
      
      newKeypaths.forEach( ( newKeypath ) => { this.targets.keypaths.push({ targetId: this.targets.maxId, keypath: newKeypath }); });
    }
    
    let source = sourceInit.replace( /^~/, target );
    
    let sourceIsKeypath = KeyPath.is( source );
    
    let sourceIsQuerypath = QueryPath.is( source );
    
    if( !sourceIsKeypath && !sourceIsQuerypath ) throw new Error( 'source must be keypath or querypath' );
    
    let itemSource = this.findItemSource( source );
        
    if( itemSource == null && sourceIsKeypath ) {
      this.sources.maxId += 1;
            
      this.sources.list.push({
        sourceId: this.sources.maxId,
        sourceInit: sourceInit,
        source: source,
        sourceType: 'keypath',
        targetLinks: 1
      });
      
      this.sources.keypaths.push( source );
      
      this.targetSourcesLinks.push({ targetId: this.targets.maxId, sourceId: this.sources.maxId });
    }
    else if( itemSource != null ) {    
      itemSource.targetLinks += 1;
      
      this.targetSourcesLinks.push({ targetId: this.targets.maxId, sourceId: itemSource.sourceId });
    }    
    else if( itemSource == null && sourceIsQuerypath ) {
      this.sources.maxId += 1;
            
      this.sources.list.push({
        sourceId: this.sources.maxId,
        sourceInit: sourceInit,
        source: source,
        sourceType: 'querypath',
        targetLinks: 1
      });
      
      let self = this;
      
      filterByQueryPath( plainObject, source ).forEach( ( keypath ) => {
        self.sources.keypaths.push( keypath );
      });
      
      this.targetSourcesLinks.push({ targetId: this.targets.maxId, sourceId: this.sources.maxId });
    }
  };
  
  CalcDbClass.prototype._getIntersections = function( firstKeypaths, secondKeypaths ) {
    
    let intersections = [];
    
    let s = new Set();
    
    firstKeypaths.forEach( ( keypath ) => { s.add( keypath ); });
    
    secondKeypaths.forEach( ( keypath ) => { if( s.has( keypath ) ) { intersections.push( keypath ); }});
    
    return intersections;
  }
  
  CalcDbClass.prototype.existsTargetKeypath = function( keypath ) {
    if( !KeyPath.isValid( keypath ) ){
      throw new Error( 'keypath is not valid' );
    }
    
    let len = this.targets.keypaths.length;
    let list = this.targets.keypaths;
    
    for( let i = 0; i < len; i++ ){
      if( keypath == list[ i ].keypath ) return true;
    }
    
    return false;
  }

  CalcDbClass.prototype.findItemSource = function( source ) {
    let length = this.sources.list.length;
    let list = this.sources.list;
    
    for( let i = 0; i < length; i++ ) {
      let item = list[ i ];
      if( item.keypath == source ) {
        return item;
      }
    }
    
    return null;
  };
  
  CalcDbClass.prototype.unregister = function( target ) {
    
  };
  
  CalcDbClass.prototype.addKeypath = function( keypath ) {
    
  };
  
  CalcDbClass.prototype.removeKeypath = function( keypath ) {
    
  };
  
  /*
    callbacks: список функций, которые будут вызваны когда на source не будет больше ссылаться ни один target
    в каждую функцию передается один параметр - source
  */
  function TargetCounter( callbacks ) {
    this.map = new Map();
    
    this.callbacks = $.Callbacks();
    
    for( let i = 0; i < callbacks.length; i++ ) this.callbacks.add( callbacks[ i ] );
    
  };
  
  TargetCounter.prototype.inc = function( source ) {
    if( !this.map.has( source )) {    
      this.map.set( source, 1 ); 
      
      return;
    }
    
    let count = this.map.get( source ) + 1;
    
    this.map.set( source, count );
  };
  
  TargetCounter.prototype.dec = function( source, callback ) {
    if( !this.map.has( source )) throw new Error( 'source not found: ' + source );
     
    let count = this.map.get( source ) - 1;
    
    if( count == 0 ) {
      this.map.delete( source );
      
      if( callback != null ) callback( source );
      
      this.callbacks.fire( source );
      
      return;
    }
    
    this.map.set( source, count );    
  };
  
  function Targets() {
    this.maxId = 0;
    this.map = new Map();
  };
  
  Targets.prototype.add = function( target, declaredSources, func ) {
    //declaredSources
    let sources = sources.map(( itemSource ) => { return itemSource.replace( /^~/, target ); });
    
    this.maxId += 1;
    
    let targetId = this.maxId;
    
    this.map.forEach(( item, key ) => { if( item.target == target ) throw new Error( 'target exists: ' + target ); });
    
    this.map.set( targetId, { targetId: targetId, target: target, sources: sources, func: func, keypaths: new Set() }); 
    
    return targetId;
    
    /*
    { 
      targetId: targetId,
      target: target,
      declaredSources: [{
        declared: '~.',
        sources: [ 'a', 'b', 'c' ],
      }],
      
      actualSources:[
        [ 'a', 'b', 'c' ],
      ]
      
      func: func, 
      keypaths: new Set() }
    */
  };
  
  Targets.prototype.addKeypath = function( keypath ) {
    
    this._checkBeforeAddKeypath( keypath );
    
    this.map.forEach(( item ) => {
      if( !QueryPath.match( item.target, keypath )) return;
            
      item.keypaths.add( keypath );
    });
  };
  
  Targets.prototype._checkBeforeAddKeypath = function( keypath ) {
    
    let querypaths = [];
    
    this.map.forEach(( item ) => {
      if( !QueryPath.match( item.target, keypath )) return;
            
      querypaths.push( item.target );
    });
    
    if( querypaths.length == 0 || querypaths.length == 1 ) return;
    
    if( querypaths.length > 1 ) {
      let str = satisfied.join();
      throw new Error( "keypath соответствуюет нескольким target: " + str );
    }
  };
  
  Targets.prototype.removeKeypath = function( keypath ) {
    
    this.map.forEach(( item, targetId ) => {            
      item.keypaths.delete( keypath );
    });
  };
  
  function Sources() {
    this.map = new Map();
  };
  
  Sources.prototype.add = function( source, keypath ) {    
    if( !this.map.has( source )) {
      this.map.set( source, new Set([ keypath ]));
      return;
    }
    
    let keypaths = this.map.get( source );
    
    keypaths.add( keypath );
  };
  
  Sources.prototype.remove = function( source, keypath ) {
    if( !this.map.has( source )) throw new Error( 'source not found: ' + source );
    
    if( keypath == null ) {
      this.map.delete( source );
      return;
    }
    
    let keypaths = this.map.get( source );
      
    keypaths.delete( keypath );
  }; 

  return {
    make: function() { return new CalcDbClass(); }
  };
  
})();