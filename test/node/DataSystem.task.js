// DS 기본 기능 테스트


// import & 일반화
var DS = require('../../src/DataSystem.js');
var DataSet     = DS.DataSet;
var DataTable   = DS.DataTable;
var DataColumn  = DS.DataColumn;
var DataRow     = DS.DataRow;

// ###########################################
{
    /**
     * 검사 함수
     * 호출시 :  dataTableView( ds.tables[0] )
     */
    function dataTableView(dt) {
        
        console.log('***********************************************');

        function getChange() {
            return dt.getChanges() ? dt.getChanges().changes : 'X';
        }        
            return {
            "1-rows" : dt.rows,
            "2-items" : dt.rows._items,
            "3-queue" : dt.rows.transQueue.queue,
            "4-changes" : getChange()
        }
    }
}

// 기본 함수 로딩 테스트
{
    console.log('### 전체 모듈 로딩 테스트 ####');
    console.log(DS.DataSet);
    console.log('##############################');

    console.log(DS.DataTable);
    console.log('##############################');

    console.log(DS.DataColumn);
    console.log('##############################');

    console.log(DS.DataRow);
    console.log('##############################');
}

{
    var ds = new DataSet("dsTest");

    // 1방식 : 생성 후 등록 방식 : 테이블
    var dt1 = new DataTable("head", ds); 
    ds.tables.add(dt1);

    // 2방식 : 직접 생성 방식 : 테이블
    var dt2 = ds.tables.add("body");

    // 1방식 : 생성 후 등록 방식 : 컬럼
    var dc1 = new DataColumn("p1_name", "string");
    var dc2 = new DataColumn("p2_name", "string");
    var dc3 = new DataColumn("p3_name", "string");
    dt1.columns.add(dc1);
    dt1.columns.add(dc2);
    dt1.columns.add(dc3);

    // 2방식 : 직접 생성 방식 : 컬럼
    ds.tables["body"].columns.add("pp1_name");
    ds.tables[1].columns.add("pp2_name");

    // console.log('### ds.table[0].columns 검사 ###');
    // console.log(ds.tables[0].columns);
    // console.log('##############################');

    // console.log('### ds.table["body"].columns 검사 ###');
    // console.log(ds.tables['body'].columns);
    // console.log('##############################');

    var dr = null;

    dr = dt1.newRow();
    dr["p1_name"] = '1번내용';
    dr["p2_name"] = '2번내용';
    dr["p3_name"] = '3번내용';
    dt1.rows.add(dr);

    dr = dt1.newRow();
    dr["p1_name"] = '10번내용';
    dr["p2_name"] = '20번내용';
    dr["p3_name"] = '30번내용';
    dt1.rows.add(dr);

    dr = dt1.newRow();
    dr["p1_name"] = '100번내용';
    dr["p2_name"] = '200번내용';
    dr["p3_name"] = '300번내용';
    dt1.rows.add(dr);

    console.log('### ds.hasChanges() 커밋전 변경 여부 ###');
    console.log(ds.hasChanges());
    console.log('##############################');    

    console.log('### ds.getChanges() 커밋 목록 ###');
    var ch1 = ds.getChanges();
    console.log(ds.getChanges());
    console.log('##############################');    

    // ds.acceptChanges();     // commit
    // ds.tables[0].rows

    console.log('### ds.hasChanges() 커밋후 변경 여부 ###');
    console.log(ds.hasChanges());
    console.log('##############################');    


    dr = dt1.newRow();
    dr["p1_name"] = '10번내용 - 중간수정';
    dr["p2_name"] = '20번내용 - 중간수정';
    dr["p3_name"] = '30번내용 - 중간수정';
    dt1.rows.insertAt(dr, 1);

    console.log('### ds.getChanges() 중간에 삽입 후 커밋 목록 ###');
    var ch2 = ds.getChanges();
    console.log(ds.getChanges());
    console.log('##############################');    


    dr = dt1.newRow();
    dr["p1_name"] = '1000번내용';
    dr["p2_name"] = '2000번내용';
    dr["p3_name"] = '3000번내용';
    dt1.rows.add(dr);
    
    // ds.tables[0].rows.removeAt(2);
    console.log('##############################');    
    
    // ds.rejectChanges();     // rollback   <== 테스트시 토글 하면서 테스트
    console.log('##############################');    

    // ##########################
    // 컬럼에 객체 데이터 추가
    dr = dt2.newRow();
    dr["pp1_name"] = '100번내용';
    dr["pp2_name"] = {abc:1};
    dt2.rows.add(dr);

    dr = dt2.newRow();
    dr["pp1_name"] = '200번내용';
    dr["pp2_name"] = "P2 200번 내용";
    dt2.rows.add(dr);
    console.log('##############################');    
    
    // ds.rejectChanges();     // rollback   <== 테스트시 토글 하면서 테스트
    console.log('##############################');    
    

    /**
     * rollback 호출시 
     *  - '10번내용 - 중간수정' : 삭제됨
     *  - '1000번내용' : 삭제됨
     * rollback 호출 없을시 (commit 포함)
     *  - '10번내용 - 중간수정' : 적용됨
     *  - '1000번내용' : 적용됨
     */
    // ds.rejectChanges();       // rollback   <== 테스트시 토글 하면서 테스트

    // *************************************
    // console.log('### ds rows 확인 ###');
    // var row1 = ds.tables[0].rows;
    // console.log(ds.tables[0].rows);
    // console.log('##############################');
    
    // ds.acceptChanges();     // commit       <== 테스트시 토글 하면서 테스트
    
    var row2 = ds.tables[1].rows;

    // ds.clear();
    // ds 데이터 삭제 여부 확인
}
{
    /**
     * 복제 테스트
     */
    console.log('### 브레이크 테스트 ###');

    var clone1 = ds.tables[1].rows[0].copyTo();

    var b1 = ds.tables[1].rows[0];
    var b2 = ds.tables[1].rows;
    var b3 = ds.tables[1].rows._items[0];
    var b4 = ds.tables[1].rows.transQueue.queue;
    var b5 = ds.getChanges();
    var b6 = b5[1].changes;
    console.log('Break');

    ds.tables[1].rows[1][0] = "복제-수정됨";
    ds.tables[1].rows[1].setModified(); // D->I 생성됨

    var b1 = ds.tables[1].rows[0];
    var b2 = ds.tables[1].rows;
    var b3 = ds.tables[1].rows._items[0];
    var b4 = ds.tables[1].rows.transQueue.queue;
    var b5 = ds.getChanges();
    var b6 = b5[1].changes;
    console.log('Break');
    
    // ds.acceptChanges();     // commit
    // ds.rejectChanges();     // rollback   <== 테스트시 토글 하면서 테스트
    
    var b1 = ds.tables[1].rows[0];
    var b2 = ds.tables[1].rows;
    var b3 = ds.tables[1].rows._items[0];
    var b4 = ds.tables[1].rows.transQueue.queue;
    var b5 = ds.getChanges();    
    // var b6 = b5[1].changes || 1;    
    console.log('Break');




    // var change = ds.getChanges();

    

    var t1 = ds.tables[1].rows[0];
    console.log('Break');

    // ds.acceptChanges();     // commit
    console.log('Break');

}

// row1                 <== 콘솔창에서 확인
// row2                 <== 콘솔창에서 확인

console.log('-End-');