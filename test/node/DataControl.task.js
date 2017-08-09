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

// ###########################################
{
    /**
     * 공통 영역
     */
    var ds = new DataSet("controlTest");
    
    var dt = ds.tables.add("T01_Table");
    
    ds.tables[0].columns.add("p1_name");
    ds.tables[0].columns.add("p2_name");
    ds.tables[0].columns.add("p3_name");

    var dr1_1    = null;
    var dr1_2    = null;
    var dr1_3    = null;
    var dr2      = null;

    dr1_1 = dt.newRow();
    dr1_1["p1_name"] = '1번';
    dr1_1["p2_name"] = '2번';
    dr1_1["p3_name"] = '3번';
    

    dr1_2 = dt.newRow();
    dr1_2["p1_name"] = '10번';
    dr1_2["p2_name"] = '20번';
    dr1_2["p3_name"] = '30번';

    dr1_3 = dt.newRow();
    dr1_3["p1_name"] = '100번';
    dr1_3["p2_name"] = '200번';
    dr1_3["p3_name"] = '300번';

    dr2 = dt.newRow();
    dr2["p1_name"] = '10번-추가';
    dr2["p2_name"] = '20번-추가';
    dr2["p3_name"] = '30번-추가';

}
// ###########################################
// 로우 삽입
{
    /**
     * A: 1차 로우 맨뒤 삽입 >> 2차 로우 특정위치 삽입 : 1차 + 2차 로우 | 커밋
     */
    dt.rows.clear();
    dt.rows.add(dr1_1);             // +1
    dt.rows.add(dr1_2);
    dt.rows.add(dr1_3);
    dt.rows.insertAt(dr2, 1);       // +2
    console.log('Break-Point');

    ds.acceptChanges();             // commit
    console.log('Break-Point');
}
{
    /**
     * B: 1차 로우 맨뒤 삽입 >> 롤백 : 데이터 없음
     */
    dt.rows.clear();
    dt.rows.add(dr1_1);             // +1
    dt.rows.add(dr1_2);
    dt.rows.add(dr1_3);
    ds.rejectChanges();             // rollback
    console.log('Break-Point');
}
{
    /**
     * C: 1차 로우 맨뒤 삽입 >> 커밋 >> 2차 로우 삽입 >> 롤백 : 1차 로우만 있음
     */
    dt.rows.clear();
    dt.rows.add(dr1_1);             // +1
    dt.rows.add(dr1_2);
    dt.rows.add(dr1_3);
    ds.acceptChanges();             // commit
    console.log('Break-Point');

    dt.rows.insertAt(dr2, 1);       // +2'
    ds.rejectChanges();     // rollback

    console.log('Break-Point');
}
// ###########################################
// 로우 삭제
{
    /**
     * A: 1차 로우 맨뒤 삽입 >> 2차 로우 삭제 : 1차 - 2차 로우 | 커밋
     */
    dt.rows.clear();
    dt.rows.add(dr1_1);             // +1
    dt.rows.add(dr1_2);
    dt.rows.add(dr1_3);
    ds.tables[0].rows.removeAt(1);  // -1
    console.log('Break-Point');

    ds.acceptChanges();             // commit
    console.log('Break-Point');
}
{
    /**
     * B: 1차 로우 맨뒤 삽입 >> 2차 로우 삭제 >> 롤백 : 데이터 없음
     */
    dt.rows.clear();                
    dt.rows.add(dr1_1);             // +1
    dt.rows.add(dr1_2);
    dt.rows.add(dr1_3);
    ds.tables[0].rows.removeAt(1);  // -1
    console.log('Break-Point');

    ds.rejectChanges();             // rollback
    console.log('Break-Point');
}
{
    /**
     * C: 1차 로우 맨뒤 삽입 >> 커밋 >> 2차 로우 삭제 >> 롤백 : 1차 로우만 있음
     */
    dt.rows.clear();
    dt.rows.add(dr1_1);             // +1
    dt.rows.add(dr1_2);
    dt.rows.add(dr1_3);
    ds.acceptChanges();             // commit
    console.log('Break-Point');

    ds.tables[0].rows.removeAt(1);  // -1
    ds.rejectChanges();             // rollback
    
    console.log('Break-Point');
}
// ###########################################
// 로우 수정
{
    /**
     * A-1: 1차 로우 맨뒤 삽입 >> 1차 로우 수정(직접수정) : 수정된 로우 | 커밋 - setModified()
     */
    dt.rows.clear();
    dt.rows.add(dr1_1);                         // +1
    dt.rows.add(dr1_2);
    dt.rows.add(dr1_3);
    dt.rows[1][0] = dt.rows[1][0] + "-수정";     // *1 (직접)
    dt.rows[1][1] = dt.rows[1][1] + "-수정";
    dt.rows[1][2] = dt.rows[1][2] + "-수정";    
    console.log('Break-Point');
    
    dt.rows[1].setModified();                   // 직접수정 갱신
    console.log('Break-Point');

    ds.acceptChanges();                         // commit
    console.log('Break-Point');
}
{
    /**
     * A-2: 1차 로우 맨뒤 삽입 >> 1차 로우 수정(삽입) : 수정된 로우 | 커밋 - updateAt()
     */
    dt.rows.clear();
    dt.rows.add(dr1_1);                         // +1
    dt.rows.add(dr1_2);
    dt.rows.add(dr1_3);
    ds.tables[0].rows.updateAt(dr2, 1);         // *1 (교체)
    console.log('Break-Point');

    ds.acceptChanges();                         // commit
    console.log('Break-Point');
}
{
    /**
     * B-1: 1차 로우 맨뒤 삽입 >> 1차 로우 수정(직접) >> 롤백 : 데이터 없음
     */
    dt.rows.clear();
    dt.rows.add(dr1_1);                         // +1
    dt.rows.add(dr1_2);
    dt.rows.add(dr1_3);
    dt.rows[1][0] = dt.rows[1][0] + "-수정";     // *1 (직접)
    dt.rows[1][1] = dt.rows[1][1] + "-수정";
    dt.rows[1][2] = dt.rows[1][2] + "-수정";    
    console.log('Break-Point');
    
    dt.rows[1].setModified();                   // 직접수정 갱신
    console.log('Break-Point');

    ds.rejectChanges();                         // rollback
    console.log('Break-Point');
}
{
    /**
     * 1차 로우 맨뒤 삽입 >> 1차 로우 수정(교체) >> 롤백 : 데이터 없음
     */
    dt.rows.clear();
    dt.rows.add(dr1_1);                         // +1
    dt.rows.add(dr1_2);
    dt.rows.add(dr1_3);
    ds.tables[0].rows.updateAt(dr2, 1);         // *1 (교체)
    console.log('Break-Point');

    ds.rejectChanges();                         // rollback
    console.log('Break-Point');
}
{
    /**
     * C-1: 1차 로우 맨뒤 삽입 >> 커밋 >> 1차 로우 수정(직접) >> 롤백 : 1차 로우
     */
    dt.rows.clear();
    dt.rows.add(dr1_1);                         // +1
    dt.rows.add(dr1_2);
    dt.rows.add(dr1_3);
    ds.acceptChanges();                         // commit
    console.log('Break-Point');

    dt.rows[1][0] = dt.rows[1][0] + "-수정";    // *1 (직접)
    dt.rows[1][1] = dt.rows[1][1] + "-수정";
    dt.rows[1][2] = dt.rows[1][2] + "-수정";    
    console.log('Break-Point');
    
    dt.rows[1].setModified();                   // 직접수정 갱신
    console.log('Break-Point');

    ds.rejectChanges();                         // rollback
    console.log('Break-Point');
}
{
    /**
     * C-2: 1차 로우 맨뒤 삽입 >> 커밋 >> 1차 로우 수정(교체) >> 롤백 : 1차 로우
     */
    dt.rows.clear();
    dt.rows.add(dr1_1);                         // +1
    dt.rows.add(dr1_2);
    dt.rows.add(dr1_3);
    ds.acceptChanges();                         // commit    
    console.log('Break-Point');

    ds.tables[0].rows.updateAt(dr2, 1);         // *1 (교체)
    console.log('Break-Point');

    ds.rejectChanges();                         // rollback
    console.log('Break-Point');
}
// ###########################################
// 로우 복합
{
    /**
     * A: 1차 로우 삽입 >> 1차 로우 수정 >> 1차 로우 삭제 >> 2차 로우 맨뒤 추가
     *    >> 커밋 : 수정/삭제된 1차 로우 + 2차 로우
     */
    dt.rows.clear();
    dt.rows.add(dr1_1);                         // +1
    dt.rows.add(dr1_2);
    dt.rows.add(dr1_3);
    console.log('Break-Point');

    ds.tables[0].rows.removeAt(1);              // -1
    console.log('Break-Point');

    ds.tables[0].rows.updateAt(dr2, 1);         // *1 (교체)
    console.log('Break-Point');

    ds.acceptChanges();                         // commit    
    console.log('Break-Point');
}
{
    /**
     * B: 1차 로우 삽입 >> 1차로우 삭제 >> 1차 로우 수정
     *    >> 커밋 >> 1차 로우 수정 >> 2차 로우 추가 >> 1차 로우 제거 
     *    >> 롤백 : 수정/삭제된 1차 로우
     */
    dt.rows.clear();
    dt.rows.add(dr1_1);                         // +1
    dt.rows.add(dr1_2);
    dt.rows.add(dr1_3);
    console.log('Break-Point');

    ds.tables[0].rows.removeAt(1);              // -1
    console.log('Break-Point');
    
    ds.tables[0].rows.updateAt(dr2, 1);         // *1 (교체)
    console.log('Break-Point');

    ds.acceptChanges();                         // commit    
    console.log('Break-Point');

    dt.rows[1][0] = dt.rows[1][0] + "-수정";    // *1 (직접)
    dt.rows[1][1] = dt.rows[1][1] + "-수정";
    dt.rows[1][2] = dt.rows[1][2] + "-수정";    
    console.log('Break-Point');

    dt.rows[1].setModified();                   // 직접수정 갱신
    console.log('Break-Point');

    dt.rows.insertAt(dr2, 2);                   // +2'
    console.log('Break-Point');

    ds.tables[0].rows.removeAt(0);              // -1
    console.log('Break-Point');

    ds.rejectChanges();                         // rollback
    console.log('Break-Point');
}

/*
    검사 위치
    -- 테이블 --    
        ds.tables[0].rows
        ds.tables[0].rows._items
        ds.tables[0].rows.transQueue.queue
        ds.tables[0].getChanges().changes

    -- 데이터셋 --
        ds.getChanges()
        ds.tables[0].getChanges()
*/
console.log('-End-');