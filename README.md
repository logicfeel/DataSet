# DataSet 1.0.1
    
    특징
    
    - 정의가 분리되어 있어서 재사용/교체가 가능
    
    - 변경사항을 감지함 (변경여부, 변경목록)

    - 이벤트 바인딩을 통한 자동화

    - 통합 인터페이스 제공 (다양한 환경 및 언어)

    - 어뎁터를 통한 확장

    - 정의(컬럼)과 데이터에 대한 다양한 접근 방식

    - 데이터 제어가 용이

    - MVC 모델의 해결 방안

## 용도 : node + web  (공통사용)
    NPM, Bower

## 종속성

    - LCommon.js : 1.0.0

## 디렉토리 구조

    - external : LCommon.js

    - src : 원본 소스
        + DataSystem.js : 데이터 시스템 관련
        
        + TransQueue.js : 트랜젝션 관련
        
    - test : 디버깅 & 테스트
        + web : 브라우저 테스트 디버깅 => 개발자도구 (IE, 크롬)

        + node : 테스트 디버깅 => VS.Code

    - dist  : 배포
        + DataSet.js  => 공통 통합 파일

    - api : 문서
        + ~.html : html 문서
        
        + ~.md : github 문서    

## 개발 시나리오

    - [x] master -> 개발 -> [태그]
    
    - [ ] master -> 브런치 -> 개발 -> 병합 -> [태그]
        (* 분리 개발이 필요한 경우)

## 태그명 규칙

    - 0.0.0 : 버전명 표기  (주버전.기능버전.패치버전)
    
        + 초기 개발시 주버전 "0" 으로 시작

        + 주버전 "1" 번부터 태그 붙임

## 브런치 규칙

    - 논리적 관점 명칭 지정

    - 브런치는 병합을 기본 병합을 목표로함
        * 파일 및 테스트 디버깅 분리의 목적

## 버전 규칙

    - 버전은 태그명으로 배포함

    - 규칙 : X.X.X        

## API

    - DataSet : public

    - DataTableCollection 

    - DataTable : public

    - DataColumnCollection

    - DataColumn : public

    - DataRowCollection

    - DataRow : public

    - TransQueue


 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * ###############################################################
 * DataSet      Tcollection             Rcollection     DataRow       
 * ----------------------------------------------------------------
 * DataSet      .tables  [0]            .rows[0]        .[0]
 * DataSet      .tables  ["tName"]                      .["cName"]
 *              .tables.count
 *                                      .rows.count
 * ================================================================ 
 * DataSet      Tcollection             Ccollection
 * ----------------------------------------------------------------
 * DataSet      .tables  [0]            .columns[0]
 * DataSet                              .columns["cName"]
 *                                      .columns.count
 * ================================================================ 


# 변경이력

> 1.0.1

> 1.0.2

    - DataRow.setModified() : 변경내용 반영 처리