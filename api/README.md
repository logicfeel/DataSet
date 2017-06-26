DataSet


| 관리 메소드        |  설명         |  비고         |
| -------------     | ------------- | ------------- |
| reset()           | 데이터 + 스키마 초기화          | Content Cell  |
| clear()           | 데이터만 초기화 (*스키마 제외)  | Content Cell  |
| copy()            | 데이터 + 스키마 복사            | Content Cell  |
| clone()           | 스키마 복사 (*데이터 제외)      | Content Cell |


| 입출력 메소드           |  설명         |  비고              |
| -------------         | ------------- | ----------------- |
| load(pObj)            | 스키마 + 데이터 로드               | Content Cell  |
| loadRow(pObj)         | 데이터 로드                        | Content Cell  |
| loadRowSchema(pObj)   | 스키마 로드                        | Content Cell  |
| get()                 | [ds] 내부 스카마 + 데이터 얻기      | 리턴 :  String or Object  |
| getRow()              | [ds] 내부 데이터 얻기              | Content Cell  |
| getRowSchema()        | [ds] 내부 스카마 얻기              | Content Cell  |


| 트랜젝션 메소드        |  설명         |  비고          | 
| -------------         | ------------- | ------------- |
| rejectChanges()       | 롤백 반영  | Content Cell  |
| acceptChanges()       | 커밋 반영  | Content Cell  |
| hasChanges()          | 변경 내용 여부  | Content Cell  |
| getChanges() : LArray | 변경 내용 얻기  | Content Cell  |


