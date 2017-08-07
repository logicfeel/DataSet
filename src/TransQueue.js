/**
 * @version 1.0.1 
 */
(function(G) {
    'use strict';
    var _G;     // 내부 전역

    /**
     * @class TransQueue
     * @version 1.0.0
     * @param {Array} pArrOriginal (*필수) 원본 배열
     * @param {Array} pArrTarget 선택
     * @classdesc 트랜젝션 큐
     * @example
     *  - 방식
     *      + callback 방식
     *      + pTarget 전달 방식
     *  - 주의사항
     *      + idx 값을 사용할때는 커밋 완료된 기점 기준으로 사용
     *         (문장이 길어지면 중간 커밋후 진행)
     * @property {Array} queue REVIEW : 테스트 시 주석제거후 사용
     */
    function TransQueue(pArrOriginal, pArrTarget) {


        var _queue      = [];
        var _before     = null;
        var _original   = pArrOriginal || null;
        var _target     = pArrTarget || null;
        
        // REVIEW : 테스트 시 주석제거후 사용
        this.queue = _queue;
        
        if (!(pArrOriginal instanceof Array)) {
            throw new Error('pArrOriginal 오류 : pArrOriginal=' + pArrOriginal);
            // return null;
        }
        
        /**
         * @name #init
         * @access public
         * @summary 큐 초기화
         * @function
         * @memberOf TransQueue
         * 
         */
        this.init = function() {
            _queue = null;
            _queue = [];
            
            // 테스트 참조 초기화
            this.queue = null;
            this.queue = _queue;
            
            console.log('init :: 큐초기화됨 ..');    
        }
        
        /**
         * @name #commit
         * @summary 큐 초기화
         * @access public
         * @function
         * @memberOf TransQueue
         */
        this.commit = function() {

            var idx = null;

            if (_target === null) {
                this.init();    
                return true;
            }

            for(var i = 0;  i < _queue.length; i++) {
                
                if ("I" in _queue[i]) {
                    idx = _original.indexOf(_queue[i]["I"].ref);
                    _target.splice(idx, 0, _queue[i]["I"].ref);
                    // console.log('commit :: insert ..')    
                }

                if ("D" in _queue[i]) {
                    idx = _queue[i]["D"].cursor_idx;
                    _target.splice(idx, 1);
                    // console.log('commit :: delete ..')    
                }

                if ("U" in _queue[i]) {
                    idx = _original.indexOf(_queue[i]["U"].ref);
                    // idx = _queue[i]["U"].cursor_idx;     // REVIEW: 문제발생시 확인
                    _target.splice(idx, 1);
                    _target.splice(idx, 0, _queue[i]["U"].ref);
                    // console.log('commit :: update ..')    
                }
            }
            this.init();
            // console.log('commit :: 내부 ..');    
            return true;
        };

        /**
         * @name #rollback
         * @summary 큐 롤백 (원본 복구됨)
         * @access public
         * @function
         * @memberOf TransQueue
         */
        this.rollback = function() {

            var idx = null;

            try { 

                // !! 주의 : 롤벡은 큐를 거꾸로 순회해야 함
                for(var i = _queue.length - 1;  i >= 0; i--) {
                        
                    if ("I" in _queue[i]) {
                        idx = _original.indexOf(_queue[i]["I"].ref);
                        _original.splice(idx, 1);                       // 등록한것 제거
                        // console.log('rollbak :: insert -> delete ..')    
                    }

                    // TODO: if 묶을필요 테스트후
                    if ("D" in _queue[i]) {
                        idx = _queue[i]["D"].cursor_idx;
                        _original.splice(idx, 0, _queue[i]["D"].clone); // 삭제한것 복귀
                        // console.log('rollbak :: delete -> insert ..')    
                    }
                    
                    if ("U" in _queue[i]) {
                        // !! 주의 롤백시 순서 바꿔야 함
                        idx = _original.indexOf(_queue[i]["U"].ref);
                        _original.splice(idx, 1);                       // 수정한것 삭제
                        _original.splice(idx, 0, _queue[i]["U"].clone); // 삭제한것 복귀
                        // console.log('rollbak :: delete -> insert ..')    
                    }
                }
                this.init();

            } catch (e) { 
                console.log('rollback 오류:' + e);
                return false;
            }
            
            return true;
        };

        /**
         * @name #insert
         * @summary 등록 : INSERT
         * @access public
         * @function
         * @memberOf TransQueue
         * @param {Object} pRowObject   대상 Row 객체
         * @param {Number} pCursorIdx   [선택] 레코드 idx 없을시 null 삽입 
         *                              (키 입력시 커밋 완료된 데이터만 가능!!)
         * @param {Function} callback   [선택]  !Target 방식 사용시 불필요
         */
        this.insert = function(pRowObject, pCursorIdx, callback) {
            
            pCursorIdx = pCursorIdx || _original.length;

            if (pCursorIdx > _original.length) {
                throw new Error('pCursorIdx 범위 초과 오류 : pCursorIdx=' + pCursorIdx);
            }

            // 1단계 : (순서중요!)
            if (_target === null) {
                if (typeof callback === "function") {
                    // Function.prototype.call(this);
                    callback.call(this);
                } else {
                    return false;
                }
            } else {
                before.splice(pCursorIdx, 0, pRowObject);
            }

            // 2단계 : (순서중요!)
            _queue.push({
                "I": {ref: _original._items[pCursorIdx], clone: null, cursor_idx: pCursorIdx}
            });

            return true;
        };

        /**
         * @name #delete
         * @summary 삭제 : DELETE
         * @access public
         * @function
         * @memberOf TransQueue
         * @param {Number} pCursorIdx   레코드 idx 필수 (커밋 완료된 데이터만 가능!!)
         * @param {Function} callback   [선택] !Target 방식 사용시 불필요
         */
        this.delete = function(pCursorIdx, callback) {
            
            if (typeof pCursorIdx === "undefined" || pCursorIdx < 0) {
                throw new Error('delete 오류 (입력없음): pCursorIdx=' + pCursorIdx);
            }

            // TODO: 정수타입 검사
            if (pCursorIdx >= _original.length) {
                throw new Error('delete 오류 (범위초과): pCursorIdx=' + pCursorIdx);
            }

            // 1단계 (순서중요!) : 백업 (참조 저장)
            _queue.push({
                "D":  {ref: null, clone: _original[pCursorIdx], cursor_idx: pCursorIdx}
            });
            
            // 2단계 (순서중요!)
            if (_target === null) {
                if (typeof callback === "function") {
                    // return Function.prototype.call(this);
                    return  callback.call(this);
                } else {
                    return false;
                }
            } else {
                _original.splice(pCursorIdx, 1);
            }

            return true;
        };

        /**
         * @name #update
         * @summary 수정 : UPDATE 내부적으로 (delete -> insert 처리됨)
         * @access public
         * @function
         * @memberOf TransQueue
         * @param {Object} pRowObject   대상 Row 객체
         * @param {Number} pCursorIdx   레코드 idx 필수 (커밋 완료된 데이터만 가능!!)
         * @param {Function} callback   [선택] !Target 방식 사용시 불필요
         */
        this.update = function(pNewDataRow, pCursorIdx, callback) {

            if (typeof pCursorIdx === "undefined" || pCursorIdx < 0) {
                throw new Error('update 오류 (입력없음): pCursorIdx=' + pCursorIdx);
            }

            if (pCursorIdx >= _original.length) {
                throw new Error('update 오류 (범위초과): pCursorIdx=' + pCursorIdx);
            }

            // 1단계 (순서중요!)  : 백업 (참조 저장)
            _queue.push({
                // "U":  {ref: null, clone: _original[pCursorIdx], cursor_idx: pCursorIdx}
                "U":  {ref: _original[pCursorIdx], clone: _original._items[pCursorIdx], cursor_idx: pCursorIdx}
            });

            // 2단계 (순서중요!)
            if (_target === null) {
                if (typeof callback === "function") {
                    // Function.prototype.call(this);
                    return  callback.call(this);
                } else {
                    return false;
                }
            } else {
                _original.splice(pCursorIdx, 1, pRowObject);
            }

            // 3단계 (순서중요!) : 참조 연결
            _queue[_queue.length - 1]["U"].ref = _original[pCursorIdx];

            return true;
        };

        /**
         * @name #select
         * @summary 변경대상 조회 : SELECT
         * @access public
         * @function
         * @memberOf TransQueue
         * @param {Object} pRowObject   대상 Row 객체
         * @param {Number} pCursorIdx   레코드 idx 필수 (커밋 완료된 데이터만 가능!!)
         * @param {Function} callback   [선택] !Target 방식 사용시 불필요
         */
        this.select = function() {
            var rows = [];

            if (0 >= _queue.length ) return null;

            for(var i = 0;  i < _queue.length; i++) {
                
                if ("I" in _queue[i]) {
                    rows.push(
                        {
                            cmd: "I",
                            row: _queue[i]["I"].ref,
                            idx: _queue[i]["I"].cursor_idx
                        }
                    );
                } else if ("D" in _queue[i]) {
                    rows.push(
                        {
                            cmd: "D",
                            row: _queue[i]["D"].clone,
                            idx: _queue[i]["D"].cursor_idx
                        }
                    );
                } else if ("U" in _queue[i]) {
                    rows.push(
                        {
                            cmd: "D",
                            row: _queue[i]["U"].clone,
                            idx: _queue[i]["U"].cursor_idx
                        }
                    );
                    rows.push(                        
                        {
                            cmd: "I",
                            row: _queue[i]["U"].ref,
                            idx: _queue[i]["U"].cursor_idx
                        }                        
                    );
                }
            }
            
            return rows;
        };
    }

    // 배포 (RequireJS 용도)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports      = TransQueue;
        _G = global;    // node 
    } else {
        _G = G;         // web
    }

    // 전역 배포
    _G.TransQueue   = TransQueue;

}(this));