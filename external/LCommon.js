/**
 * @version 1.0.2
 *  - splice / add 오버라이딩함 
 */

//####################################################
// Merge file : common.js
(function(G) {
    'use strict';
    var _G;     // 내부 전역

    // 배열 차원 검사 (최대 제한값 10 설정됨)
    // 첫번째 배열만 검사 (배열의 넢이가 같은 겨우만)
    // _getArrayLevel(pElem) 사용법
    // pDepts : 내부 사용값
    function getArrayLevel(pElem, pDepts) {
        var MAX     = 10;
        var level   = 0;
        
        pDepts = pDepts || 0;

        if (pElem instanceof Array && MAX > pDepts) {
            level++;
            pDepts++;
            level = level + this.getArrayLevel(pElem[0], pDepts);  // 재귀로 깊이 찾기
        }
        return level;
    }

    // REVIEW: 공통화 필요
    function isArray(pValue) {
        if (typeof Array.isArray === "function") {
            return Array.isArray(pValue);
        } else {
            return Object.prototype.toString.call(pValue) === "[object Array]";
        }
    }


    /**
     * 배포
     * node 등록(주입)  AMD (RequireJS) 방식만 사용함
     * ! 추후 CommonJS (define) 방식 추가 필요함
     */
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.getArrayLevel    = getArrayLevel;
        module.exports.isArray          = isArray;
        _G = global;    // node 
    } else {
        _G = G;         // web
    }

    // 전역 배포 (모듈형식)
    _G.L                    = _G.L || {};
    _G.L.arr                = _G.L.arr || {};
    _G.L.arr.getArrayLevel  = getArrayLevel;
    _G.L.arr.isArray        = isArray;


}(this));


//####################################################
// Merge file : LArray.js

(function(G) {
    'use strict';
    var _G;     // 내부 전역

    /**
     * !! prototype 노출형 부모 (부모.call(this);  <= 불필요
     * 제한1 : var(private) 사용 못함
     * 제한2 : 생성자 전달 사용 못함
     * 제한3 : 부모.call(this) 비 호출로 초기화 안됨
     * 장점 : 중복 호출 방지 (성능 향상)  **
     * @name LAarry (LoagicArayy)
     */
    function LArray() {

        this.isDebug        = false;
        this._items         = [];
        this._SCOPE         = "LArray";
    }
    (function() {   // prototype 상속 정의
        LArray.prototype =  Object.create(Array.prototype); // Array 상속
        LArray.prototype.constructor = LArray;
        LArray.prototype.parent = Array.prototype;
    }());

    // !! 여긴 staitc 변수가 됨
    // LArray.prototype._items = [];
    // LArray.prototype._SCOPE = "LArray";
    
    LArray.prototype._init = function() {
        // PATH : 1.0.2
        // LArray.prototype._items = [];
        this._items = [];
    };
    
    LArray.prototype._setPropertie = function(pIdx) {
        
        var obj = {
            get: function() { return this._items[pIdx]; },
            set: function(newValue) { this._items[pIdx] = newValue; },
            enumerable: true,
            configurable: true
        };
        return obj;        
    }

    LArray.prototype.setPropCallback = function(pPropName, pGetCallback, pSetCallback) {
        
        var obj = {
            enumerable: true,
            configurable: true
        };
        
        if (typeof pGetCallback === "function") {
            obj.get = pGetCallback;
        } else {    // 겟터 기본값 설정  :: PATH
            obj.get = function(){return null};
        }

        if (typeof pSetCallback === "function") {
            obj.set = pSetCallback;
        
        } else {    // 셋터 기본값 설정  :: PATH
            obj.set = function(){};
        }

        Object.defineProperty(this, pPropName, obj);
    }

    /**
     *  - pValue : (필수) 값  
     *      +  구조만 만들경우에는 null 삽입
     *  - 객체는 필수, pAttrName : (선택) 속성명
     * TODO : 키와 이름 위치 변경 검토?
     */
    LArray.prototype.pushAttr = function(pValue, pAttrName) {
        
        var index   = -1;
        
        this.push(pValue);
        // this._items.push(pValue);

        index = (this.length === 1) ? 0 : this.length  - 1;

        Object.defineProperty(this, [index], this._setPropertie(index));
        if (pAttrName) {
            Object.defineProperty(this, pAttrName, this._setPropertie(index));
        }
    };

    // TODO: 삭제 구현 필요
    // pAttrName (필수)
    LArray.prototype.popAttr = function(pAttrName) {
        
        var idx = this.indexOfAttr(pAttrName);

        delete this[pAttrName];                 // 내부 이름 참조 삭제
        return this.splice(idx, 1);                    // 내부 참조 삭제
        // PATH 1.0.2
        // return this._items.splice(idx, 1);      // _items 삭제
    };

    LArray.prototype.indexOfAttr = function(pAttrName) {
        
        var idx = this._items.indexOf(this[pAttrName]);
        return idx;
    };

    // index 로 속성명 찾기
    LArray.prototype.attributeOfIndex = function(pIndex) {

        for (var prop in this) {
            if ( this.hasOwnProperty(prop)){
                if (!isFinite(prop) && this[prop] === this[pIndex]) {
                    return prop;
                }
            }
        }

        return null;
    };

    // Array 오버라이딩 :: PATH 
    LArray.prototype.splice = function() {

        var params = Array.prototype.slice.call(arguments);
        
        Array.prototype.splice.apply(this._items, params)
        return Array.prototype.splice.apply(this, params);
    };

    // Array 오버라이딩 :: PATH 
    LArray.prototype.push = function() {

        var params = Array.prototype.slice.call(arguments);
        
        Array.prototype.push.apply(this._items, params);
        return Array.prototype.push.apply(this, params);
    };


    /**
     * 배포
     * node 등록(주입)  AMD (RequireJS) 방식만 사용함
     * ! 추후 CommonJS (define) 방식 추가 필요함
     */
    if (typeof module !== 'undefined' && module.exports) {
        module.exports  = LArray;
        _G = global;    // node 
    } else {
        _G = G;         // web
    }

    // 전역 배포 (모듈형식)
    _G.L                    = _G.L || {};
    _G.L.class              = _G.L.class || {};
    _G.L.class.LArray       = LArray;

}(this));


//####################################################
// Merge file : Observer.js

(function(G) {
    'use strict';
    var _G;     // 내부 전역

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // 옵서버 패턴 
    // @종속성 : 
    function Observer(pThis) {
        
        this.isDebug = true;
        this._this = pThis;
        this.subscribers = {
            any: []     // 전역 구독자
        };
    }
    (function() {   // prototype 상속

        // 구독 신청
        Observer.prototype.subscribe = function(pFn, pType) {
            
            var subscribers = null;
            
            pType = pType || 'any';
            if (typeof this.subscribers[pType] === "undefined") {
                this.subscribers[pType] = [];
            }
            subscribers = this.subscribers[pType] ;
            subscribers.push(pFn);
        };

        // 구독 해제
        Observer.prototype.unsubscribe = function(pFn, pType) {
            pType = pType || "any";
            if (this.subscribers[pType]) {
                for (var i = 0; i < this.subscribers[pType].length; i++) {
                    if (pFn === this.subscribers[pType][i]) {
                        this.subscribers[pType].splice(i, 1);
                    }
                }
            }
        };

        // 구독 함수 호출
        Observer.prototype.publish = function(pType) {

            var args = Array.prototype.slice.call(arguments, 1);    // pType 이후부터 배열로 저장

            pType = pType || "any";
            if (pType in this.subscribers) {
                for (var i = 0; i < this.subscribers[pType].length; i++) {
                    this.subscribers[pType][i].apply(this._this, args);
                }
            }
            
            if (this.isDebug) {
                console.log("publish() 이벤트 발생 [" + this._this.constructor.name + "] type:" + pType);
            }
            
        };
    }());

    function LEvent(pThis) {
        Observer.call(this, pThis);      // ### prototype 상속 ###

        this.isDebug = false;
        this.eventList = [];
    }
    (function() {
        // ### prototype 상속 ###
        LEvent.prototype               = Object.create(Observer.prototype); // Array 상속
        LEvent.prototype.constructor   = LEvent;
        LEvent.prototype.parent        = Observer.prototype;

        // ### 메소드 ###

        // 이벤트 발생
        LEvent.prototype.event = function(pType) {
            
            var args = Array.prototype.slice.call(arguments, 1);    // pType 이후부터 배열로 저장
            var obj = null;         // 내부 e 역활 정의

            args.splice(obj, 0);    // 내부 전달값 맨 앞에 삽입

            this.publish.apply(this, pType, args);

        };

        // 이벤트 매핑
        // TODO: 필요 여부 확인후 구현 또는 제거
        LEvent.prototype.onEvent = function(pType) {
        };        

        // 이벤트 등록
        LEvent.prototype.addEvent = function(pType, pFn) {
            if (this.eventList.indexOf(pType) > -1) {
                this.subscribe(pFn, pType);
            } else {
                throw new Error('pType 에러 발생 pType:' + pType);
            }
        };

        // 이벤트 해제
        LEvent.prototype.removeEvent = function(pType, pFn) {
            if (this.eventList.indexOf(pType) > -1) {
                this.unsubscribe(pFn, pType);
            } else {
                throw new Error('pType 에러 발생 pType:' + pType);
            }
        };

    }());    

    /**
     * 배포
     * node 등록(주입)  AMD (RequireJS) 방식만 사용함
     * ! 추후 CommonJS (define) 방식 추가 필요함
     */
    if (typeof module !== 'undefined' && module.exports) {
        module.exports  = Observer;
        _G = global;    // node 
    } else {
        _G = G;         // web
    }

    // 전역 배포 (모듈형식)
    _G.L                    = _G.L || {};
    _G.L.class              = _G.L.class || {};
    _G.L.class.Observer     = Observer;

}(this));


