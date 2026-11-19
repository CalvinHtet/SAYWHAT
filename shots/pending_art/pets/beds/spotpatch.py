import sys
p,bx,by,px,py=sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5]
s=open(p).read()
a='if(h("bd_dbed1")){dbed(2.0);if(h("bd_dbed2"))dbed(4.7)}'
assert a in s
s=s.replace(a,a+';lfSpr(C,"hmx_dogbed",%s,%s,1.2,1.0,{h:6,ctr:1,H:40,dk:.2})'%(bx,by))
b='["pt_dbed2","Second Patio Dog Bed",UP_S,"","",0,0,0,"Chopstick\'s own. Nobody has to share the sun.",{art:["hmx_dogbed",.2,3.8,1.1,.9,30,{}]}],'
assert b in s, 'patio'
s=s.replace(b,b+'["pt_pbed","Pet Bed Test",UP_S,"","",0,0,0,"x",{art:["hmx_dogbed",%s,%s,1.1,.9,30,{}]}],'%(px,py))
open(p,'w').write(s)
