# spotpatch2.py app.js d1x d2x petx pety petw petd chairdx  (patio: dog beds, a stand-in pet bed, the lounge chair shifted by chairdx)
import sys
p=sys.argv[1]; d1x,d2x,px,py,pw,pd,cdx=sys.argv[2:9]
s=open(p).read()
def rep(a,b):
    global s
    assert a in s, a[:60]; s=s.replace(a,b)
rep('{art:["hmx_dogbed",1.6,3.8,1.1,.9,30,{}]}','{art:["hmx_dogbed",%s,3.8,1.1,.9,30,{}]}'%d1x)
rep('{art:["hmx_dogbed",.2,3.8,1.1,.9,30,{}]}]','{art:["hmx_dogbed",%s,3.8,1.1,.9,30,{}]}],["pt_pbed","Pet Bed Test",UP_S,"","",0,0,0,"x",{art:["hmx_dogbed",%s,%s,%s,%s,30,{}]}]'%(d2x,px,py,pw,pd))
c=float(cdx)
rep('lfSpr(C,"hmx_chair1",4.2,3.45,1.1,1.1,{h:58,flip:1});C.s("chair",4.75,4.0,','lfSpr(C,"hmx_chair1",%.2f,3.45,1.1,1.1,{h:58,flip:1});C.s("chair",%.2f,4.0,'%(4.2+c,4.75+c))
open(p,'w').write(s)
