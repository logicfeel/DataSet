// ##########################################
{
    /**
     * 뷰설정
     */
    
    var ds;

    // 뷰 테이블 설정 : 이름도 설정 경우에 따라서
    ds.tables[0].view["RegForm"] = [
        {   
            view : "addr",
            attr: {f_type: "A_type"},
            ref: [ "p_id",  "member", {
                name: "code",
                ref : ["p_code", "content"]
            }]
        },
        {   
            view : "member_id",
            ref: [ "s_id",  "s_name"]
        }
    ];
    
}
{
    /**
     * 사용 사례
     * 
     */
    var cAd_Code = new ContainerAdapter();
    cAd_Code.setContainer("addr");
    cAd_ListSrh.containers["addr"].column.setSlot("th", [
        {
            name: "p1_name",
            selector: "h1"
        },
        {
            name: "p2_name",
            selector: "h2"
        }
    ]);

}
