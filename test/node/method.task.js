// DS 기본 기능 테스트


// import & 일반화
    var LArray;
    var Observer;

    require('../../external/LCommon.js');
    LArray = global.L.class.LArray;
    Observer = global.L.class.Observer;



{
    var ll = new LArray();
    ll.pushAttr(1, "abc");
    ll.pushAttr(function(a, b) {
        console.log('a=' + a);
    }, "fff");
}
ll.fff(1)
ll['fff'](1)

console.log('-End-');