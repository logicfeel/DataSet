/**
 * @version 0.1.1 
 */
(function(G) {
    'use strict';    
    var _G;     // 내부 전역

    // ## import & 네이밍 표준 설치
    var TransQueue;
    var LArray;
    var Observer;

    if (typeof module !== 'undefined' && module.exports) {

        if (global.TransQueue) {
            TransQueue = global.TransQueue;
        } else {
            TransQueue = require('./TransQueue.js');
        }

        require('../external/LCommon.js');
        LArray = global.L.class.LArray;
        Observer = global.L.class.Observer;
    
    } else if(G.TransQueue){
        TransQueue = G.TransQueue;
        LArray = G.L.class.LArray;
        Observer = G.L.class.Observer;
    } else {
        console.log('ERR: TransQueue 함수 로딩 실패');
    }

    /**
     * DataSet
     * 데이터 셋
     * @param {String} pDataSetName 데이터셋 이름
     * @example
     * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     * ###############################################################
     * DataSet      T-collection            R-collection    DataRow       
     * ----------------------------------------------------------------
     * DataSet      .tables  [0]            .rows[0]        .[0]
     * DataSet      .tables  ["tName"]                      .["cName"]
     *              .tables.count
     *                                      .rows.count
     * ================================================================ 
     * DataSet      T-collection            C-collection
     * ----------------------------------------------------------------
     * DataSet      .tables  [0]            .columns[0]
     * DataSet                              .columns["cName"]
     *                                      .columns.count
     * ================================================================ 
     */
    function DataSet(pDataSetName) {

        this.tables = new DataTableCollection(this);
        // this.dt = this.tables;      // Ref?
        this.dataSetName = pDataSetName;
        this._event         = new Observer(this, this);
        this.eventList      = ["commit", "rollback", "change"];
        this.onCommit       = null;     // 커밋완료 후 + 성공시 : callback(ds)
        this.onRollback     = null;     // 커밋완료 후 + 성공시 : callback(ds)
        this.onChange       = null;     // 변경이후 : callback(ds)
    }
    (function() {

        // ########################################
        // 교체 블럭 시작

        // dataReader 를 통한 가져오기
        // REVIEW: 가져오기 옵션 있음
        DataSet.prototype.load = function(pDataSet) {
        };

        // DataRows 를 제거 (columns 스키마는 유지됨)
        DataSet.prototype.clear = function() {
            this.tables.clear();
        };

        // TODO : 나중에
        // 구조복사  (데이터 복사X)
        DataSet.prototype.clone = function() {};
        
        // 구조 + 데이터 복사
        DataSet.prototype.copy = function() {};

        // DataSet 로딩 (tables + rows + columns)
        DataSet.prototype.read = function(pDataSet) {

            var ds          = null;
            var dataTable   = null;

            try {
                
                if (!pDataSet || !pDataSet.tables) {
                    throw new Error('pDataSet  tables 객체 없음 :');
                }

                for (var i = 0; i < pDataSet.tables.length; i++) {
                    dataTable = new DataTable(null, this);
                    dataTable.read(pDataSet.tables[i]);
                    this.tables.add(dataTable);
                }
            } catch (e) { 
                console.log('DataSet load 오류 :' + e);
            }
        };

        // MS: 호환성
        DataSet.prototype.readXml = DataSet.prototype.read;          

        // 스키마 (datatable, column 설정)
        DataSet.prototype.readSchema = function(pDataTables) {
            // var datTables = {};

            // for (var table in pDataTables) {
            //     if ( pDataTables.hasOwnProperty(table)){
            //         datTables[table] = new DataTable(table);

            //         // 생각좀...
            //         // TODO:
            //     }
            // }
        };

        // MS: 호환성
        DataSet.prototype.readXmlSchema = DataSet.prototype.readSchema;              

        DataSet.prototype.readXmlSchema = function() {};    // MS: 호환성

        // 교체 블럭 종료
        // ########################################
        
        // 리셋 : 데이터 + 스키마
        // TODO :
        DataSet.prototype.reset = function() {
        };

        // 지우기 : 데이터
        DataSet.prototype.clear = function() {
            this.tables.clear();
        };

        // 복사 : 스키마 + 데이터
        // TODO:
        DataSet.prototype.copy = function() {
        };        

        // 복제 : 스키마
        // TODO:
        DataSet.prototype.clone = function() {
        };
        
        // 외부 => 내부 ds : 데이터 + 스키마
        DataSet.prototype.load = function(pDataSet) {
            var ds          = null;
            var dataTable   = null;

            try {
                
                if (!pDataSet || !pDataSet.tables) {
                    throw new Error('pDataSet  tables 객체 없음 :');
                }

                for (var i = 0; i < pDataSet.tables.length; i++) {
                    dataTable = new DataTable(null, this);
                    dataTable.read(pDataSet.tables[i]);
                    this.tables.add(dataTable);
                }
            } catch (e) { 
                console.log('DataSet load 오류 :' + e);
            }
        };

        // 외부 => 내부 ds : 데이터
        // TODO:
        DataSet.prototype.loadRow = function() {
        };
        
        // 외부 => 내부 ds : 스키마
        // TODO :
        DataSet.prototype.loadSchema = function() {
        };

        // 내부ds => 외부 : 데이터 + 스키마
        // TODO :
        DataSet.prototype.get = function() {
        };
        
        // 내부ds => 외부 : 데이터
        // TODO:
        DataSet.prototype.getRow = function() {
        };

        // 내부ds => 외부 : 데이터 + 스키마
        // TODO:
        DataSet.prototype.getSchema = function() {
        };


        // commit (변경내용처리)
        DataSet.prototype.acceptChanges = function() {
            
            var isSuccess = true;
            
            for(var i = 0; i < this.tables.length; i++) {
                isSuccess = this.tables[i].acceptChanges();
                
                if (!isSuccess) return false;
            }

            // 이벤트 발생
            if (typeof this.onCommit === "function" ) {
                this.onCommit.call(this);
            }
            this._event.publish("commit");

            return isSuccess;
        };
        
        // rollback (변경내용 커밋전으로 되돌림)
        DataSet.prototype.rejectChanges = function() {

            var isSuccess = true;
            
            for(var i = 0; i < this.tables.length; i++) {
                isSuccess = this.tables[i].rejectChanges();
                
                if (!isSuccess) return false;
            }

            // 이벤트 발생
            if (typeof this.onRollback === "function" ) {
                this.onRollback.call(this);
            }
            this._event.publish("rollback");

            return isSuccess;
        };

        // 변경내용 가져옴
        DataSet.prototype.getChanges = function() {
            
            var changes     = new LArray();
            var collection  = null;
            var tableName   = "";
            
            // changes._items = [];

            for(var i = 0; i < this.tables.length; i++) {
                collection = this.tables[i].getChanges();
                if (collection) {
                    tableName = this.tables[i].tableName;
                    
                    // 구조 개선
                    // changes.pushAttr.call(changes, collection, tableName);   
                    changes.pushAttr(collection, tableName);
                }
            }
            if (0 >= changes.length) return null;
            return changes;
        };

        // commit 여부 조회
        DataSet.prototype.hasChanges = function() {
            
            var collection = null;
            
            for(var i = 0; i < this.tables.length; i++) {
                collection = this.tables[i].getChanges();
                
                // 첫번째 내용 발견시
                if (collection) return true;
            }
            return false;
        };

        // 이벤트 등록
        DataSet.prototype.onEvent = function(pType, pFn) {
            if (this.eventList.indexOf(pType) > -1) {
                this._event.subscribe(pFn, pType);
            } else {
                throw new Error('pType 에러 발생 pType:' + pType);
            }
        }

        // 이벤트 해제
        DataSet.prototype.offEvent = function(pType, pFn) {
            if (this.eventList.indexOf(pType) > -1) {
                this._event.unsubscribe(pFn, pType);
            } else {
                throw new Error('pType 에러 발생 pType:' + pType);
            }
        }        

    }());

    /**
     * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 
     * 데이터테이블 컬렉션
     * @param {DataSet} pDataSet 데이터셋
     */
    function DataTableCollection(pDataSet) {
        LArray.call(this);      // ### prototype 상속 ###

        this._dataSet = pDataSet;
        this.setPropCallback("count", function() {return this._items.length});
    }
    (function() {
        // ### prototype 상속 ###
        DataTableCollection.prototype =  Object.create(LArray.prototype); // Array 상속
        DataTableCollection.prototype.constructor = DataTableCollection;
        DataTableCollection.prototype.parent = LArray.prototype;

        // ### 메소드 ###
        
        // pObject : String = 테이블명
        // DataTable : 데이터테이블 객체
        DataTableCollection.prototype.add = function(pObject) {

            var table = null;

            if (typeof pObject === "string") {      
                table = new DataTable(pObject, this._dataSet);
            } else if (pObject instanceof DataTable) {
                table = pObject;
            } else {
                return null;
            }

            // this 위치 수정
            this.pushAttr(table, table.tableName);
            // this.pushAttr.call(this, dataTable, dataTable.tableName);

            return  table;
        };

        // 데이터테이블 초기화
        DataTableCollection.prototype.clear = function() {
            for (var i = 0; i < this._items.length; i++) {
                this._items[i].clear();
            }
        };
        
        // 지정 컬렴 여부
        //  pTableName, pColumnName (선택)
        DataTableCollection.prototype.contains = function(pTableName, pColumnName) {
            
            if (pTableName && pColumnName) {
                return this._items[this.indexOf(pTableName)].columns.contains(pColumnName);
            } else {
                return (0 <= this._items.indexOf(pTableName));
            }
        };
        
        // TODO: 필요시 구현해도 됨
        DataTableCollection.prototype.copyTo = function() {};
        
        // 객체 비교
        DataTableCollection.prototype.equals = function(pObject) {
            return (this._items === pObject);
        };
        
        // 객체의 index 값 조회
        DataTableCollection.prototype.indexOf = function(pObject) {
            
            for (var i = 0; i < this._dataSet.tables.length; i++) {
                
                if (typeof pObject ==="string") {
                    if (this._dataSet.tables[i].tableName === pObject) return i;
                } else if (pObject) {
                    if (this._dataSet.tables[i] === pObject)  return i;
                }
            }
            return -1; 
        };
        
        // rollback 안됨 (비추천) 바로 commit 됨
        DataTableCollection.prototype.remove = function(pObject) {
            
            var index = -1;

            index = this._items.indexOf(pObject);

            if (0 <= index) {
                return this.removeAt(index);               // 배열 요소 삭제
            } else {
                return [];
            }        
        };

        DataTableCollection.prototype.removeAt = function(pIdx) {
            this.splice(pIdx, 1);                   // 내부 참조 삭제
            delete this[pIdx].columnName;           // 내부 이름 참조 삭제
            return this._items.splice(pIdx, 1);     // _items 삭제
        };

    }());

    /**
     * 데이터테이블
     * @param {String} pTableName 테이블명
     */
    function DataTable(pTableName, pDataSet) {
        
        var _this           = this;

        this._dataSet       = pDataSet;
        this.columns        = new DataColumnCollection(this);
        this.rows           = new DataRowCollection(this);
        this.tableName      = pTableName;
        this._event         = new Observer(this, this);
        this.eventList      = ["change", "insert", "update", "delete"];
        this.onChange       = null;     // 처리후 : callback(데이터테이블)
        this.onInsert       = null;     // 처리후 : callback(데이터테이블)
        this.onUpdate       = null;     // 처리후 : callback(데이터테이블)
        this.onDelete       = null;     // 처리후 : callback(데이터테이블)
        
        // 이벤트 관련
        if (this._dataSet instanceof DataSet) {
            this._event.subscribe(function() {
                // 이벤트 발생
                if (typeof _this._dataSet.onChange === "function" ) {
                    pDataSet.onChange.call(this);
                }
                _this._dataSet._event.publish("change");
            }, "change");
        }

        this._event.subscribe(function() {
            _this._event.publish("change"); // 이벤트 발생
        }, "insert");

        this._event.subscribe(function() {
            _this._event.publish("change"); // 이벤트 발생
        }, "update");

        this._event.subscribe(function() {
            _this._event.publish("change"); // 이벤트 발생
        }, "delete");
    }
    (function() {

        // ### 메소드 ###

        // row의 넢이 검사
        function _equalRowWidth(pRow) {
            
            var rowWidth = -1;
            
            // TODO: 이중배열 여부 검사
            for (var i = 0; i < pRow.length; i++) {
                
                // 첫번째 row 넢이 
                if (i === 0) {
                    rowWidth = pRow[i].length;

                    // 넢이가 없는 경우
                    if (0 >= rowWidth) return false;
                } else {

                    // 넚이가 다른 경우
                    if (rowWidth !== pRow[i].length) return false;
                }
            }
            return true;
        }
        
        function _getObjectType(pObject) {
            // REVIEW: 필요시 조건 삽입
            // switch (typeof pObject) {
            //     case 1:
            //         doSomethig();
            //         break;
            //     case 2:
            //         return true;
            //     default:
            //         return "string";
            // }
            return typeof pObject;
        }

        // DataTable 로딩
        // TODO: 컬럼을 가져 오는지, Rows 를 가져 오는지, 둘다가져오는지 ?
        // 둘다 가져오는듯  (naver검색 결과)
        // 컬럼여부를 유추를 파악해서 등록함
        // JSON 또는 객체를 가져오는 기능이 되야함
        // !pSchema 는 DataTable과 같은 기준으로 검사함
        // 동적 메소드
        DataTable.prototype.read = function(pTableDataObj) {

            var dataTable   = null; 
            var dtRows      = pTableDataObj["rows"];
            var dtColumns   = pTableDataObj["columns"];
            var dtTableName = pTableDataObj["tableName"];
            var column      = null;
            var dr          = null;
            
            // 스키마 읽기 
            this.readSchema(pTableDataObj);

            // 데이터 읽기 (rows)
            try { 
                // 입력 pSchema 검사 
                if (!pTableDataObj) {
                    throw new Error('입력스키마 pSchema 오류 tableName:' + dtTableName);
                }
                if (!dtTableName) {
                    throw new Error('테이블이름 없음 오류 tableName:' + dtTableName);
                }
                if (dtRows && 2 > common.getArrayLevel(dtRows)) {
                    throw new Error('rows 이중배열 아님 오류 :');
                }
                if (dtRows && !_equalRowWidth(dtRows)) {
                    throw new Error('rows의 item 갯수가 다름 오류 :');
                }
                if (!dtRows && !dtColumns) {
                    throw new Error('rows와 columns 없음 오류 :');
                }

                dataTable = new DataTable(dtTableName, this._dataSet);
                
                // *************************
                // 로우 데이터 가져오기
                if (dtRows) {

                    // 컬럼.count == 로우.conunt 검사 (이미 넢이는 검사했으므로..)
                    if (dtRows[0].length !== this.columns.count) {
                        throw new Error('rows !== columns  오류 row.index:' + i);
                    }

                    for(var i = 0; i < dtRows.length; i++) {
                        dr = dataTable.newRow();
                        for (var ii = 0; ii < dtRows[i].length; ii++) {
                            dr[ii] = dtRows[i][ii];
                        }
                        dataTable.rows.add(dr);
                    }
                }
            } catch (e) { 
                console.log('DataTable read 오류: ' + e);
            }
            
            // 개체 복사
            this.rows = dataTable.rows;
            
            return dataTable;        
        };


        DataTable.prototype.readSchema = function(pTableDataObj) {

            var dataTable   = null; 
            var dtRows      = pTableDataObj["rows"];
            var dtColumns   = pTableDataObj["columns"];
            var dtTableName = pTableDataObj["tableName"];        
            var column      = null;
            
            try { 
                // 입력 pSchema 검사 
                if (!pTableDataObj) {
                    throw new Error('입력스키마 pSchema 오류 tableName:' + dtTableName);
                }
                if (!dtTableName) {
                    throw new Error('테이블이름 없음 오류 tableName:' + dtTableName);
                }
                if (dtColumns && !(dtColumns instanceof Array)) {
                    throw new Error('colum 배열 아님 오류 :');
                }

                dataTable = new DataTable(dtTableName, this._dataSet);
                
                // *************************
                // 컬럼 스키마 가져오기

                if (dtColumns) {
                    
                    // A. 컬럼 스키마가 있는 경우
                    for (var i = 0; i < dtColumns.length; i++) {
                        
                        // 필수 요소 검사
                        if (!(dtColumns[i]["columnName"] && dtColumns[i]["dataType"])) {
                            throw new Error('colum에 필수 정보 (columnName, dataType)없음 오류 tableName:' + dtTableName);
                        }
                        
                        column = new DataColumn( dtColumns[i]["columnName"], dtColumns[i]["dataType"],
                                dtColumns[i]["caption"], dtColumns[i]["defaultValue"], dtColumns[i]["unique"]);
                        dataTable.columns.add(column);
                    }
                } else if (dtRows) {

                    // B. 컬럼스키마가 없는 경우
                    // 첫번째 row를 가져와서 컬럼 스키마를 생성
                    for (var i = 0; i < dtRows[0].length; i++) {
                        column = new DataColumn("column_" + i, _getObjectType(dtRows[0][i]));
                        dataTable.columns.add(column);
                    }
                }

            } catch (e) { 
                console.log('DataTable readSchema 오류: ' + e);
            }
            
            // 개체 복사
            this.tableName = dataTable.tableName;
            this.columns = dataTable.columns;
            
            return dataTable;          
        };

        // MS: DataReader 
        DataTable.prototype.load = function(pTableDataObj) {};


        // DataRow 만 초기화 (!columns는 유지됨/스키마는 유지)
        DataTable.prototype.clear = function() {
            this.rows   = new DataRowCollection(this);
        };

        DataTable.prototype.select = function() {
            console.log('DataTable. select');
        };
        
        // row 추가
        DataTable.prototype.newRow = function() {
            var dataRow = null;
            dataRow = new DataRow(this);
            return dataRow;
        };

        // TODO : 나중에
        DataTable.prototype.clone = function() {};
        DataTable.prototype.copy = function() {};

        // commit (변경내용처리)
        DataTable.prototype.acceptChanges = function() {
            return this.rows.transQueue.commit();
        };
        
        // rollback (변경내용 커밋전으로 되돌림)
        DataTable.prototype.rejectChanges = function() {
            return this.rows.transQueue.rollback();
        };    

        // 변경내용 가져옴
        DataTable.prototype.getChanges = function() {

            var table = {};
            var getChanges = this.rows.transQueue.select();
            
            if (!getChanges) return null;

            table["table"] = this.tableName;
            table["changes"] = getChanges;
            
            // return this
            return table;
        };

    }());

    /**
     * 테이터컬럼 컬렉션
     * @param {DataTable} pDataTable 데이터테이블
     */
    function DataColumnCollection(pDataTable) {
        LArray.call(this);  // ### prototype 상속 ###

        this._dataTable = pDataTable;
        this.setPropCallback("count", function() {return this._items.length});
    }
    (function() {   
        // ### prototype 상속 ###
        DataColumnCollection.prototype =  Object.create(LArray.prototype); // Array 상속
        DataColumnCollection.prototype.constructor = DataColumnCollection;
        DataColumnCollection.prototype.parent = LArray.prototype;

        // ### 메소드 ###

        DataColumnCollection.prototype.add = function(pObject) {
            
            var column = null;

            if (typeof pObject === "string") { 
                column = new DataColumn(pObject, "string");
            } else if (pObject instanceof DataColumn) {
                column = pObject;
            } else {
                return null;
            }

            this.pushAttr(column, column.columnName);

            return column;
        };
        
        // 데이터컬럼
        DataColumnCollection.prototype.clear = function() {
            this._dataTable.columns  = new DataColumnCollection(this._dataTable);
        };
        
        // 지정 컬렴 여부
        DataColumnCollection.prototype.contains = function(pColumnName) {
            
            for (var i = 0; i < this._items.length; i++) {
                if (this[i].columnName === pColumnName) return true;
            }
            return false;
        };
        
        // TODO: 필요시 구현해도 됨
        DataColumnCollection.prototype.copyTo = function() {};
        
        // 객체 비교
        DataColumnCollection.prototype.equals = function(PObject) {
            return (this === pObject);
        };
        
        // 객체의 index 값 조회
        // 객체 또는 컬럼명 으로 조회
        DataColumnCollection.prototype.indexOf = function(pObject) {

            for (var i = 0; i < this.length; i++) {
                
                if (typeof pObject ==="string") {
                    if (this[i].columnName === pObject) return i;
                } else if (pObject) {
                    if (this[i] === pObject)  return i;
                }
            }
            return -1;        
        };
        
        DataColumnCollection.prototype.remove = function(pObject) {
            
            var index = -1;

            index = this.indexOf(pObject);
    
            if (0 <= index) {
                return this.removeAt(index);               // 배열 요소 삭제
            } else {
                return [];
            }
        };

        DataColumnCollection.prototype.removeAt = function(pIdx) {
            /* PATH : 1.0.2
            this.splice(pIdx, 1);                   // 내부 참조 삭제
            delete this[pIdx].columnName;           // 내부 이름 참조 삭제
            return this._items.splice(pIdx, 1);     // _index 삭제
            */
            return this.splice(pIdx, 1);
        };

    }());

    /**
     * 데이터 컬럼
     * @param {String} pColumnName 컬럼명
     * @param {String} pType  typeOf 값의 결과값 정보 원시값 : "string", "number"... 
     * @param {Object} pConfigs  설정정보 
     * @example
     *   {
     *       columnName: "", dataType: "", caption: "",
     *       defaultValue: "", unique: ""
     *   }
     */
    function DataColumn(pColumnName, pType, pCaption, pDefaultValue, pUnique) {
        Array.call(this);  // ### prototype 상속 ###

        this.columnName     = pColumnName || null;
        this.dataType       = pType || null;

        this.caption        = pCaption || null;
        this.defaultValue   = pDefaultValue || null;
        this.unique         = pUnique || false;

        // 필수값 검사
        // columnName, dataType
        if(this.columnName === null || this.dataType === null) {
            throw new Error('데이터컬럼 columnName, dataType = null  오류 ');
        }

    }
    (function() {
        // ### prototype 상속 ###
        DataColumn.prototype =  Object.create(Array.prototype); // Array 상속
        DataColumn.prototype.constructor = DataColumn;
        DataColumn.prototype.parent = Array.prototype;

        // ### 메소드 ###

        DataColumn.prototype.equals = function(PObject) {
            return (this === pObject);
        };   

    }());

    /**
     *  데이터 로우 컬렉션 Row
     *  LArray 에서 배열 조정함
     * @param {DataTable} pDataTable 데이터테이블
     * 
     */
    function DataRowCollection(pDataTable) {
        LArray.call(this);  // ### prototype 상속 ###

        this._dataTable = pDataTable;   // var _dataTable = pDataTable; <== this 로 변경함
        this.transQueue = new TransQueue(this, null); // PATH-1.0.2: _items 을 원본으로 지정
        this.setPropCallback("count", function() {return this._items.length});
    }
    (function() {   
        // ### prototype 상속 ###
        DataRowCollection.prototype =  Object.create(LArray.prototype); // Array 상속
        DataRowCollection.prototype.constructor = DataRowCollection;
        DataRowCollection.prototype.parent = LArray.prototype;

        // ##### 메소드 ####

        function _push(pDataRow) {
            
            var idx = -1;

            this.push(pDataRow);               // PATH-1.0.2: 복제본 저장
            idx = this.indexOf(pDataRow);
            this[idx] = pDataRow.copyTo();
        }

        function _insertAt(pDataRow, pIdx) {
            
            var idx = -1;
            
            this.splice(pIdx, 0, pDataRow);    // PATH-1.0.2: 복제본 저장
            idx = this.indexOf(pDataRow);
            this[idx] = pDataRow.copyTo();
            
            // this._items.splice(pIdx, 0, pDataRow);
        }    
        
        function _removeAt(pIdx) {
            // return this._items.splice(pIdx, 1);     // _index 삭제 
            return this.splice(pIdx, 1);                   // 내부 참조 삭제
        }

        // REVIW: 테스트전
        function _updateAt(pDataRow, pIdx) {
            _removeAt.call(this, pIdx);                 // PATH-1.0.2: call 추가함
            _insertAt.call(this, pDataRow, pIdx);       // PATH-1.0.2: call 추가함
        }

        DataRowCollection.prototype.add = function(pDataRow) {

            // TYPE1: TransQeueue 사용 안할 경우
            // this.push(pDataRow);     
            
            // TYPE2: TransQeueue 사용 사용
            var bindPushFunc = _push.bind(this, pDataRow);  

            this.transQueue.insert(pDataRow, null, bindPushFunc);
            
            // 이벤트 발생
            if (typeof this._dataTable.onInsert === "function" ) {
                this._dataTable.onInsert.call(this);
            }
            this._dataTable._event.publish("insert");

        };

        DataRowCollection.prototype.clear = function() {
            this._dataTable.rows =  new DataRowCollection(this._dataTable);
            this.transQueue.init();
        };
        
        // column 값 여부
        // TODO: 필요시 구현해도 됨
        DataRowCollection.prototype.contains = function() {};

        // column 값 리턴
        // TODO: 필요시 구현해도 됨
        DataRowCollection.prototype.find = function() {};

        // TODO: 필요시 구현해도 됨
        DataRowCollection.prototype.copyTo = function(pIdx) {
            
            // var rows   = new DataRowCollection(this._dataTable);
            // var dataRow = null;

            // if (typeof pIdx === "number") {
            //     dataRow = new DataRow(this._dataTable);
            // }else {
            // }

            // dataRow = new DataRow(this._dataTable);
            // this._dataTable.newrow()
        };
        
        // TODO: 뭐랑 비교하는 정 확인 필요
        DataRowCollection.prototype.equals = function(pObject) {
            return (this === pObject);
        };
        
        DataRowCollection.prototype.indexOf = function(pDataRow) {

            for (var i = 0; i < this._items.length; i++) {  // PATH-1.0.2: 상위 items 비교함
                if (this._items[i] === pDataRow) return i; 
            }
            for (var i = 0; i < this.length; i++) {         // PATH-1.0.2: 자신 items 비교함
                if (this[i] === pDataRow) return i; 
            }
            return -1;
        };
        
        DataRowCollection.prototype.insertAt = function(pDataRow, pIdx) {
            
            if (pDataRow instanceof DataRow &&  typeof pIdx === "number") {
                
                // TYPE1: TransQeueue 사용 안할 경우
                // this.splice(pIdx, 0, pDataRow);

                // TYPE2: TransQeueue 사용 사용
                var bindInsertAtFunc = _insertAt.bind(this, pDataRow, pIdx);  
                this.transQueue.insert(pDataRow, pIdx, bindInsertAtFunc);

                // 이벤트 발생
                if (typeof this._dataTable.onInsert === "function" ) {
                    this._dataTable.onInsert.call(this._dataTable);
                }
                this._dataTable._event.publish("insert");

                return true;
            }
            return false;
        };
        
        // rollback 안됨 (비추천) 바로 commit 됨 :: delete() 메소드로 사용
        // !! 자동커밋 처리 안되게함 (MS 방식 차이점)
        DataRowCollection.prototype.remove = function(pDataRow) {
            return this.removeAt(this.indexOf(pDataRow));
        };

        // rollback 안됨 (비추천) 바로 commit 됨 :: delete() 메소드로 사용
        // !! 자동커밋 처리 안되게함  (MS 방식 차이점)
        DataRowCollection.prototype.removeAt = function(pIdx) {
            
            // TYPE1: TransQeueue 사용 안할 경우
            // return this.splice(pIdx, 1);

            // TYPE2: TransQeueue 사용 사용
            var bindRemoveAtFunc = _removeAt.bind(this, pIdx);  
            var isSuccess  = this.transQueue.delete(pIdx, bindRemoveAtFunc); 
            
            if (isSuccess) {
                // 이벤트 발생
                if (typeof this._dataTable.onDelete === "function" ) {
                    this._dataTable.onDelete.call(this._dataTable);
                }
                this._dataTable._event.publish("delete");            

                return true;
            } 

            return false;
        };

        // 로우 수정사항 갱신
        DataRowCollection.prototype.update = function(pOldDataRow, pNewDataRow) {
            return this.updateAt(pNewDataRow, this.indexOf(pOldDataRow));
        };

        //  로우 수정사항 갱신(idx)
        DataRowCollection.prototype.updateAt = function(pNewDataRow, pIdx) {
            
            var bindUpdateAtFunc = _updateAt.bind(this, pNewDataRow, pIdx);
            var isSuccess  = this.transQueue.update(pNewDataRow, pIdx, bindUpdateAtFunc);

            if (isSuccess) {
                // 이벤트 발생
                if (typeof this._dataTable.onUpdate === "function" ) {
                    this._dataTable.onUpdate.call(this._dataTable);
                }
                this._dataTable._event.publish("update");            

                return true;
            } 
        };        

    }());

    /**
     * 데이터로우
     * 주의!! REVIEW: TArray _items 오버라이딩함
     * @param {DataTable} pDataTable 데이터테이블
     */
    function DataRow(pDataTable) {
        LArray.call(this);
        
        var columnName = "";

        this._dataTable = pDataTable;    // 소유한 데이터테이블

        if (pDataTable instanceof DataTable) {
            for (var i = 0; i < this._dataTable.columns.length; i++) {
                columnName = this._dataTable.columns[i].columnName;      // !! 버그 발견함 this 이슈
                this.pushAttr(null, columnName);
                // this.pushAttr.call(this, null, columnName);
            }
        }

        this.setPropCallback("count", function() {return this._items.length});
    }
    (function() {
        // ### prototype 상속 ###
        DataRow.prototype =  Object.create(LArray.prototype); // Array 상속
        DataRow.prototype.constructor = DataRow;
        DataRow.prototype.parent = LArray.prototype;

        // PATH-1.0.2: 객체 깊은 복제
        function _clone(obj) {
            if (obj === null || typeof(obj) !== 'object') return obj;

            var copy = obj.constructor();

            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) {
                    copy[attr] = _clone(obj[attr]);
                }
            }
            return copy;
        }

        // ##### 메소드 ####

        DataRow.prototype.delete = function() {
            
            var idx = this._dataTable.rows.indexOf(this);
            
            this._dataTable.rows.removeAt(idx);
        };
        
        // PATH-1.0.2: 복제본 저장
        DataRow.prototype.copyTo = function() {
            
            var copy  = new DataRow(this._dataTable);
            
            // REVIEW 등록후 수정하는 경우가 있어서

            for (var i = 0; i < this.length; i++) {
                copy[i] = _clone(this[i]);
            }
            return copy;
        };

        DataRow.prototype.setModified = function() {
            
            var idx = this._dataTable.rows.indexOf(this);
            var oldDataRow = this._dataTable.rows._items[idx];
            // (기존로우, 신규로우)
            this._dataTable.rows.update(oldDataRow, this);
        };

        // 변경 적용 관련 (불필요함:DataTable에서 row 관리)
        // row => 컬럼의 변화를 관리할 필요시에 구현
        DataRow.prototype._acceptChanges = function() {};
        DataRow.prototype._rejectChanges = function() {};

    }());

    
    // 배포 (RequireJS 용도)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.DataSet      = DataSet;
        module.exports.DataTable    = DataTable;
        module.exports.DataColumn   = DataColumn;
        module.exports.DataRow      = DataRow;
        _G = global;    // node 
    } else {
        _G = G;         // web
    }
    // 전역 배포
    _G.DataSet              = DataSet;
    _G.DataTable            = DataTable;
    _G.DataColumn           = DataColumn;
    _G.DataRow              = DataRow;

}(this));