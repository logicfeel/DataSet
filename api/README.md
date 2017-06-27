DataSet


| 관리 메소드        |  설명         |  비고         |
| -------------     | ------------- | ------------- |
| reset()           | 데이터 + 스키마 초기화          |   |
| clear()           | 데이터만 초기화 (*스키마 제외)  |   |
| copy()            | 데이터 + 스키마 복사            |   |
| clone()           | 스키마 복사 (*데이터 제외)      |  |


| 입출력 메소드           |  설명         |  비고              |
| -------------         | ------------- | ----------------- |
| load(pObj)            | 스키마 + 데이터 로드               |   |
| loadRow(pObj)         | 데이터 로드                        |   |
| loadRowSchema(pObj)   | 스키마 로드                        |   |
| get() : Object<JSON>          | [ds] 내부 스카마 + 데이터 얻기      | 리턴 :  String or Object  |
| getRow() : Object<JSON>       | [ds] 내부 데이터 얻기              |   |
| getRowSchema() : Object<JSON> | [ds] 내부 스카마 얻기              |   |


| 트랜젝션 메소드        |  설명         |  비고          | 
| -------------         | ------------- | ------------- |
| rejectChanges()       | 롤백 반영  |   |
| acceptChanges()       | 커밋 반영  |   |
| hasChanges()          | 변경 내용 여부  |   |
| getChanges() : LArray | 변경 내용 얻기  |   |


