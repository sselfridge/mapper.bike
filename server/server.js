const express = require("express");
const app = express();
const path = require("path");
const decodePolyline = require("decode-google-map-polyline");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const mongoose = require("mongoose");
const fs = require("fs");

// const mongoURI = "mongodb://localhost/meinmap";
// mongoose.connect(mongoURI, { useNewUrlParser: true });

const stravaController = require("./controllers/stravaController");
const analyticController = require("./controllers/analyticsController");
// const squirrel = require("./controllers/squirrel");
const zip = require("../config/zip_lat_lang");
const heartbeatFreq = 1000 * 60 * 5; //milliseconds to minutes.
let heartbeatLast = Date.now();

const config = require("../config/keys");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(analyticController.getUserData);
 
//Testing route for turning a path to polyline
app.get("/api/getPath", (req, res) => {
  console.log(`Hitting getPath`);
  //static poly lines for testing purps
  let polyDroppedTwice =
    "qfqnEpvxqUu@d@G?OCGEWc@cD}GqB{Dy@kBsBiEm@iAgDeHa@w@KYmBkE{MoXoJwSY]g@i@a@s@IGSII?_@R_CbBgAz@mAv@c@`@_J|G_@LK?KGwCqGa@u@[MSBoClBwCxByAbAQFw@f@}IpGiAp@cAt@KBM?IEEKa@eA_@w@kBkESSKCE@qDdCo@f@c@b@Y^s@lAWl@e@~AQ|@Ix@G|@?xANrCELIHmBvA}@v@u@j@qGdEoBzAuChBqGrEiFnD_ClB}DpCKJi@^k@ZmA`A_BhAm@\\k@d@uA|@u@n@iA\\MLe@P]`@w@j@uBbBoDhCa@^O\\Aj@TdBXvAz@rBt@pArBfE`AlB?LKRs@d@URGJ{AnAORk@^uBhBqGbFuAnAe@ZWVo@^KLIGIF?BN@HCEE@GE??BAGAJKLwAbAgAx@CLe@\\OR]V}@z@uAbAe@h@q@d@YZSL[XOKIUIs@C_@MiA?KBITYxAeAbByALAJDFJh@pA^r@@NELIHcAp@{BlBu@t@?@SNg@h@_Ax@iA|@{@d@GNEFkCtBCD?LKLo@f@iBzAaAbAuB|AkAfASV]NDLNLFADEPa@HMFCXGn@g@j@i@lBaBJMFS`@[X[j@c@f@Wz@u@TKvAgArA{A^YhAeArAeBXYtAcAVMTOZ]pAkAb@g@rAeAxAuA|FwENI~@w@NIbA_A`As@JMLCHMZMFOTUN?JEVW`@UBM?KGGICIBk@j@uAhAIL}@x@_Ax@[PmBfBuC|BI@KGMc@Ug@Jb@XNPNE@CDIDGACKEBAICB@AE?DHRH?FEFmDlCs@r@g@`@CNGHqAlAYHKNWR_BdAa@ZEBGCMQSu@q@_Ee@uB_@gAe@_AuDaGw@wAwCyEaB}CiCaEkEqHeH_LwCkFoDaGk@kA}BqD]w@COaEoHqDaG}@cBsAiByBiDEMa@w@_@i@c@w@kBuCQ_@SWQMy@e@aAq@YW}@kAcBqCOMIAI@_@T{CxCw@r@YPkAFkAPg@Du@P{@`@_@Xc@f@W`@k@xAY`@SRcAn@_CjBuAz@WN{B|@gBz@qDnAqChAs@Pg@Du@AwDF_AF_BPq@RwEjCS@IIcDmKoBkFwAaDiA_CsCuF_BkCs@sAg@s@GQk@q@k@{@}@mAcAmAqBoCmC_DmBkBsHcIq@iAa@w@uAsEQoBGqBRqH?wCIsAOoB[uCe@uCkAwFg@oBg@aCYeA_@qAyAeEgBwD{AyCgByC}AuC[q@G]BqI?[D_@CeE?oFC{C?sDBa@AuA@qCAkEEk@Gm@[}@a@u@q@eAe@eASs@UmB]wAY}@aBqE_@_AmDgGeCeE@Cy@sAUm@Ou@MkASyAq@yFGo@G[MWOk@YkBU}@o@mAuAiB[y@{@_Dw@}Be@}@mC}D[o@Ka@Ce@Ag@@{F?sCCiA@cEEiHEkB@eAE}C@wKC{AEOGKKIKEw@CqAAi@BeHBqAOkCDWBkAXsB\\iAZa@Dw@NyDRgBDs@FmANq@L_BLYFIFc@f@e@|@[hAMVQT_@^yAdBi@\\c@Ne@A_Eu@G@_@Io@IyA?gAYk@Mm@BqATwBPy@I[KEEc@IQAmABuA_@{@G_@Di@Po@HUDMAGBcA^cAl@MAUHGHIBw@AKCUM[]?S^m@HGVCJ@XJHATE\\On@]NUDcADKHILEJ?JDj@f@ZDZCTOHKh@{AVMZGf@CHEHKBM?QAOGMGEKEM?[@c@TSTGLu@lBIHUJMAWM_@o@i@uASUKC[BMDSRGLI^A`AE`@MZIJMDY?[CMEWQa@i@SMWCc@DWGUUEMCMA]PcANgB^mAFc@Be@Cu@KUS]OMc@WIGMSEWCaACSGOUOe@IYCe@HIHIVCTDl@AVYrA?VDd@AXMb@ONIBSAQOIYAk@Gg@KY_@k@MYUw@IKUQ[G]AOBKFY`AKJMJm@PKLEf@Fh@FPJNh@b@JLFNBPN`CE`@K`@GLKJO?OEMKGSA_AEQKKMEQDW\\i@pAWjAIVg@Nk@DUDSJSNmBpCMTUp@MRSHi@J{@DS@SCMIKMc@}@u@aA_@cBi@iA]m@GWMQEAG?QHm@b@UHUBs@?[LOPKTeA|DMTSP[D[CmC_A_@EO@]NWXw@hAUb@IROn@Gp@@ZPnABv@QjEMv@i@xB}@tFIfA?~BCt@Kb@ILa@j@U^Gd@@d@PhADd@B`BFjAAd@CREPINOJm@BMBWRGLENInCM`@{AnAyBhCI\\?PNpANfBJXTPJBXBLERU^w@VYNIp@UlASRINOJQ`AgBNORMRETDh@TRFRARErAe@vAYl@ITAVBRNLTD\\HtBEZKVy@r@KRGVCt@Hp@Tf@NNPJTD|AJfANl@Tz@p@j@Vn@HfBETBRDPJZ\\NZXz@Vd@XTn@T`@DNChAi@`@IN?NHXVBPAT[|@I`AERi@fAMd@ARBR\\~@@N?PQj@g@z@M^Gd@GfDK\\e@v@k@xAGb@@PBPJNVTxAx@JLFN@P?RMb@e@dACT@XHTLRl@r@j@x@Rj@Hn@D~BFt@Nr@x@xBRp@DV@r@Ip@ITWd@QLa@NoAVuEnAKFGLCN?RBRVx@Jl@HzAAvAHd@d@rAPt@P\\VPx@RLDRXFb@CjBD^FNTTl@b@h@l@Vd@j@~ARZHJ\\L|@Jj@NZLLFHLFN?RUtA?b@L\\t@tAV|AN`@Zn@lAtBHb@Fd@Bd@BvACb@Sl@e@l@a@^WPy@Xq@H{@A_ABcAAi@BSFSJaAbAc@ZaAZSJUNe@h@cAhBUViAz@iB|BQ\\K`@i@dCQZUVo@h@UVa@|@SXWTYPo@RYBgA?WDSL{@r@cAj@WFY@w@EYBYLQT?f@F^d@~Aj@lDBb@C`@O^g@t@UVWPYJqAHi@?MBOH{@z@Wf@Mh@g@nEIhA?vALrED|CD`@F|CHr@R^n@j@NTNTFXBZAJWjACVBTJPJJNHTDl@ErA]N?VFTPZ`@PNXH`AJ`@Jd@N`@TZ`@HTDV?TKf@u@bC_@f@u@v@O`@EZ?\\H|ADb@@v@cAhFMR{@z@YZOZc@dAWh@KJu@j@gATMFYBCDe@Hi@NUNIRI`@AVJ|ALfA@d@Od@INw@h@ILGN?h@J|@DfAAt@Gx@IZg@lAg@nBk@nAWt@]l@IXAXLnA?r@It@s@|CATV`BAPINWPmA^MHO\\CPBp@Hn@L^j@`AD`@CPQZULGHQf@C^@b@Hv@Fd@d@pBTx@j@p@dAx@`@`@b@bAPl@Ll@Bp@?x@AZMv@IXgAnCgAhCu@pDEj@?j@FvATpB\\xAdAvDnArFj@rBTjA@f@a@|OI`AuCnLYd@_@\\gAf@QVIZA^@L^zATrD@d@Af@Ed@W|AMjAKlDW`Ae@v@{BrBGVEV@XXjDF\\LXRRl@`@PRNXf@~ANZvB|Cn@n@t@f@VVR\\P`@RjAFdACx@BbA@PP`A?n@Mf@Wj@[`@ENQn@Iz@s@vBIf@Ef@Pb@VPbAd@\\ZjAlBF\\@REr@U|B?XBVPd@`AtAFNLf@J~@Ld@TH\\XLn@?TCVs@lBY`BSp@c@x@u@nBEp@@lAH`ALl@NTf@~@t@t@tHzEnBhAjAx@j@n@\\h@Td@Tp@j@VRL`BlBjCdC~AtA`Al@dDfC~BvBNRHRDXCp@i@fBi@rAQn@ALIHB@C?BCBB@AFIJGVFbD`BtBjA`Ap@jDfCfFzEx@j@^N~@T`@D^?~@KlBc@^C\\AnGb@rJFnHTX?nDKfAKfA[bAm@j@c@bGuFtAkATOhAm@dBw@vCyAl@c@pA{Al@e@jGaDbA[fASjAEr@?dCXjB^pFrAdF~A~@V^Hb@B`@@dAE`@G~@W\\Ot@m@VYT]P_@XiAf@uDPiADuAN_AJ]P]RWh@g@VKXIp@KV?j@P|@`@hA\\bATdALt@FlADbCGhOiBbAEvOmA~Fa@jDYpDk@tEgA|@Yx@_@lBeA`C{AxB}AzAoAlBkBrDyDx@aBfA}Al@i@p@a@RAv@OvCs@d@Uf@YnEoDzBaBhBaBzHuGfBmAhEkDhIiG~@w@pAmAt@w@V_@h@a@hCiC|@u@nCoBlIyGvAcAlSuP~@k@bHcGbBoAvAwAf@c@bBsAdD_ChDsC`A_AlY_VrI}GlDkCL[XUpAaAhCuBrDaDtFgEp@o@tC{BpD{CtBkBdEmDpCyBpCcCxKyIdByA`Aq@^]fAu@ZQ\\M`@KlBW`@M^ShFaEnDiClDkCbBkAjA_ArGwE^Qr@U|Ds@PGrCoBJCLBDPCLHLHZLVLf@Lj@RnAJ^?J|@nBVz@ZjAx@lB~CdIN`@tAfDh@vAdC`GhAtCdArBf@rAV|@HFJDR@VUz@m@jCuBbAs@fB{ApImGd@a@r@y@\\k@Zm@Vq@Rs@VqAJw@NmCHw@Lu@Ru@Ro@f@cAl@{@`@a@t@o@pBqAxPcMv@c@fAe@|@u@tKeI|CwB`BuAb@]r@o@RY";
  let polyHollyWoodNichols =
    "encoEpzeqUCvBDnA?|AFpDBbFAFBVDx@?|ACz@HzD@jCHpE?fBDdCCt@DfEETBFCBE?ELDXBjAJlBI\\DzBAH@x@KjA@JEX@z@NLBJCP?x@Dp@E^?VGFC?M|@@@?VLhBBbA?n@G`@NjBLjDE^BL?VATIX@h@GbEBdAAp@GfBMbCM~FKhDAjBBbGCdDG~B@pUErBCJGHIBi@DkCh@uCt@yAFq@JcFDkANyAHa@F[Je@Vo@fAKXOt@Wn@[`@c@`@Wf@s@x@c@^QFM?eAQ_@K_AM_@MaBa@y@Aw@?wAa@c@Go@FaAXeBNMD}@IoAa@kB?y@Ye@Gs@@eAb@c@FWH_@Dk@Lq@h@MDe@Dq@PUBSCc@a@KOGOLc@f@Sp@EL?JIJCN@`@IXQF]Ay@BMJGPIPB`@b@RJLDTARCLEJQNg@Vo@^S|@ANU@SMo@CGQG_@D_@ZUb@U~@O\\W`@MD_@IKEWU@ABL?Af@J\\CPSp@iBX]`@SRCR?RFDTAVETk@Pa@BOBOHMJKPY`AIRMLO@SAQGQGKSMKMCQDOJIPAXBX?TOPQH}@XUD{@@OHMJMd@AZJRJF~@Bb@G~@UnAs@PGf@QvA[f@QRETAj@H|@^j@FVIVAV@TD`A\\n@@XAp@IfAYfAIX?p@HjAVZDt@@ZBzGlAn@Aj@_@b@w@lBeCLW\\{AL[b@o@TSl@KbBKv@KnBOfBC`EQ~Bc@x@URAdCg@LBZ?\\Dl@AhAJBGCO[EK?KB[?m@CEECB[EM@oGxAc@LYLUFaCLsBHkCBe@JwBTeAPi@POLy@nAWv@Uf@s@|@MHY\\}@jASPUF_@BoASe@McAQ{Aa@}ACq@Qu@Mk@Ag@F_AVaBNm@Gm@Se@IwA?WC_A]k@Ic@BwBf@_AVc@N_@\\SHi@Fu@NWB_@IYWCGAG@SLe@JINBRAD@j@Gx@UNIDEHQD{@BIPMHEH?JDXZTJ`@BVIJGh@wANYTMz@KHEFKH_@CSGMMGYCa@LQLOR{@xBGHWFWCSQQ_@g@uAOWWMM?KBa@TSXG^IpAKZUNWDo@OUOWc@IGKEWGg@DWCSQKWC[@KRcANmBTw@He@@a@Im@Oa@U_@YU[i@Ko@?c@CWCKMSSK]Kc@AWLQRCJEX@f@CZQXOd@AZDp@AXUf@GDODMCKSCKA{@AMSi@]e@OYU}@IMKIME_@CO@MDYX@NGb@GLGHKD]BW^Oh@@RZt@f@b@N\\PzA@^En@K^ILQBOAQGIQC}@EQIMKIKAKFMLOb@u@pCOJUDy@BQFc@Zm@x@eA~AKR_@`AOLQHoBLSCKGKMk@gAu@gAu@sBm@kAUg@YKG@MH[`@GFUD_ABQHYVIXQ|@o@~BEZGJUP]BMCmAm@iBi@QCQBMF]ZU\\s@tASj@Kr@Et@VlB@ZA\\MpCSrAc@`BMl@}@vFGhA?rBGp@Q^k@t@IPKd@?f@PbBBfBLfB?RGf@IPOJ_@B]?MBYT@XCjAKzAGNUZMFc@`@aApAc@v@ELUVKb@PlBDr@F^NR\\BLAVOHMXo@V_@ZOfAWz@KPK\\a@`AeBNQPKTCx@ZPBd@ExBm@z@Q`AGTDNJJRAjADt@?XGXMRc@`@IRITGt@Dt@FXLTNPRJVB`CPf@Hb@NtAbARJTFl@B~ACj@J\\XT^Lj@Pl@LTTRd@PZD\\AZKt@]\\IN@NDVPDPANWlAK~@Mf@i@jAEVATXfABPAb@Sr@]p@Md@MlAGlBG`@GN]f@K`@_@nACb@BRDNJLzAj@ZVFNDf@CPERc@hAGT?VDVJRtAzAVl@Nt@Bt@@rAHv@ZpAn@bBHVHp@Ct@In@IT[b@OJSFuAVkBXcBd@YPGN?h@^xANnA@ZAnADn@bA`DZZjATNHHJHP@TGdBFt@FLz@d@b@`@Xf@\\z@HJXt@NVXLv@Fx@N\\JTTFN@PCPK`@Cp@Jl@~@fBRfAJ`@Zn@~@zAP\\L`@Fr@@vCK`@GLSXoAbA]P_@Ju@LqAGU@}@D}@?g@JSJ{@jAQNi@Tm@LUHQNMZa@n@_@v@OVUVkAt@}@nAk@l@O\\W~Aa@|AQVq@b@QTSZ_@|@QZq@b@w@NwA@YBWLy@v@cAh@YF]?w@I[DUP[r@@ZHXb@~@r@bDF^@^Cb@M^QZg@p@WRYHe@Ds@@OAa@BKRMLs@n@Yf@IZWrAUrBMn@E\\FnGA|G@~@FPHh@`@p@r@j@^h@L\\@JGr@]~@GV?JVZRJRDj@CdB]R?HB\\Nl@r@ZN\\Ft@BPDf@Nb@VNNHPDZ?TCVYrAGb@W`AOZy@lAM`@Ez@JrCKj@Sz@c@~BK\\QV}@z@OV}@rB[`@_@Z[NsBf@SH]VQZOt@Br@NrBKv@GR}@h@KLCRARJbAHjA@rAEZGZKXm@lAo@nB]r@Yr@k@dAGXJdBAn@KfAMj@ATQb@Ed@Bd@Tv@Df@GRWZeA`@SXERGd@Bd@Jb@p@|ADPBRGPi@t@KJGNAd@Bd@PpAbA~DJR^\\r@f@`@b@f@dANr@Hx@B\\?|@A^I\\c@tAOXg@lAy@zA_@fAa@xAMl@Gl@CdAFfALdARdApA`FnAtFdA|DBh@EdCMfDGjCMbCEd@]pBuBlISZWXqAz@U\\ERAR@RZ|AFf@NfCAbAe@nEKxAG`BMr@Uj@a@d@e@b@{@l@MVIXC|@@\\P|BJZJVRTp@j@PVj@~AP\\b@t@fB~BVVhA|@TXP\\L^F`@J`AFdCVhB?h@Qr@e@x@KZOr@Ep@GVa@`ASt@E`A@HLPTRx@^VRl@|@h@|@Ln@GRYrCA\\Db@Rd@h@r@Tf@L`@Jx@Ld@RX^\\Nd@Gj@c@zAOr@W~A_A|BM`@Id@Eh@C~@L|ANn@Tl@LRr@v@pEpC`HrEl@p@z@pALZFVJLPJf@NJFjAvAz@|@|DjD`FxDfC~BHPFl@I|@e@xAYr@IHOd@AXGFCNAICH?FBIDABBFEEMKCIF?FCB@@LC^UH@tCbB`DdBzAdA~AnAtBnBrCfCt@d@z@Z|@J^?\\C\\IvA_@\\E|@CvCHrBLfDJvGF`FPjAA`DIp@Ir@OdAi@xAiA~EsEPWrAgAhJsERO|AcBRQj@]dE{B~@_@x@Sx@MrACvADl@F|AXlFlAvBn@vCbAr@Rx@Lv@Hz@?x@It@Sn@[TORQ\\e@Ta@Tu@BC`@yBRo@DU?WLeALsALu@J[Zq@d@e@`Ai@n@En@DlCv@fB\\dDTl@@vCUlN_BzIo@rN{@fD[nEq@pDu@x@Uv@]lDwB~DuCtBgBvAsAzC_D`BsB?EPOf@y@FUp@m@z@a@bAS~@YhAOVKbAg@hFuDhC_BbCuB~AeArB{AvAqArBwAhDwBdCkB|C{BpAmAhBgBlF{FvAiAnAoA`Au@~EcExAiA~@eAb@o@|@_ArF{EvGqFpA_AbBqAbCqBz@y@pB}AnHeGNI?@BATQxBqBj@c@tBwBlDiCbAaAvLuJfCeC@IDEPCLGxAkAl@a@jG_FXSbAg@FGHW@BVKRQlAmAxAaAdDgCZc@zBgB~BqBb@c@fCoB^[\\c@vF_FbHyFvBcBpAkAfCuBtJ{HrA}@tAiAf@Wf@OfAOPEF?DDJ?RMjCqBpA}@~LcJbG}DnB}ArA}@bA]`Cg@~@]\\StAiAXOJ?JDHJFN`AfETt@H`@`@fARz@Vx@`FlMvAfD~G`Q~AfDJ^^PTNRB\\Q|AcA|F_FvDiClCqBt@o@n@q@d@s@f@cAb@_BT{AZsEJu@Ls@^gAd@aANSjAoAj@g@pA{@tB{AzM_Kf@YjAe@PItAkA`LeI`BuAjBwANKPCLIf@e@BIJS";

  let polyArray = [];
  var decodePath = decodePolyline(polyDroppedTwice);
  polyArray.push(decodePath);
  var decodePath = decodePolyline(polyHollyWoodNichols);
  polyArray.push(decodePath);

  // function sleep(time, callback, arg) {
  //   var stop = new Date().getTime();
  //   while (new Date().getTime() < stop + time) { ; }
  //   callback.send(arg);
  // }
  // sleep(3000,res, JSON.stringify(decodePath));

  res.send(JSON.stringify(polyArray));
});

app.get(
  "/api/getStravaUser",
  stravaController.loadStravaProfile,
  (req, res) => {
    if (res.locals.err) {
      res.status(444).send("Error during profile fetch");
      return;
    }
    if (res.locals.user) {
      //user profile exists send infoback
      console.log(`User logged in to strava`);
      res.send(JSON.stringify(res.locals.user));
      return;
    }
    //no user logged in
    console.log(`User not logged in to strava`);
    res.status(201).send("User Not logged in");
  }
);

//This route has been deprecated, keeping it around for a bit in case the
// new issue has bugs popup
app.get("/api/getLatLngZip/:zip", (req, res) => {
  if (!/^\d{5}/.test(req.params.zip)) {
    res.status(400).send("Only 5 digit zipcodes allowed");
    return;
  } //only query if zip is 5 numbers
  const latlng = zip(req.params.zip);
  if (latlng === null) {
    res.status(400).send(`Invalid zipcode: ${req.params.zip}`);
    return;
  }
  const center = {
    lat: latlng[0],
    lng: latlng[1]
  };
  res.json(center);
});

app.get("/api/strava/callback", stravaController.setStravaOauth, (req, res) => {
  console.log(`Strava CallBack Happening`);
  if (res.locals.err) {
    console.log(res.locals.err);
    res.status(523).send("Error with Oauth");
  }
  res.redirect(config.redirect_url);
});

app.get(
  "/api/getActivities",
  stravaController.loadStravaProfile,
  stravaController.getActivities,
  stravaController.getPointsFromActivities,
  (req, res) => {
    console.log(`Sending Back ${res.locals.activities.length} activities`);
    res.send(JSON.stringify(res.locals.activities));
  }
);

app.get(
  "/api/getDemoData",
  stravaController.getDemoData,
  stravaController.getPointsFromActivities,
  (req, res) => {
    console.log(`Sending Back ${res.locals.activities.length} activities`);
    res.send(JSON.stringify(res.locals.activities));
  }
);

app.get("/api/logout", stravaController.clearCookie, (req, res) => {
  res.send("Ok");
});

// statically serve everything in the build folder on the route '/build'
if (process.env.NODE_ENV === "production") {
  console.log(`Server in Production mode!`);
  app.use("/build", express.static(path.join(__dirname, "../build")));
  // serve index.html on the route '/'
  app.get("/", (req, res) => {
    console.log("Sending out the index");
    res.sendFile(path.join(__dirname, "../index.html"));
  });

  // TODO: redo this to bundle image in webpack
  app.get("/client/img/:image", (req, res) => {
    const imagePath = path.join(__dirname, `../client/img/${req.params.image}`);
    fs.exists(imagePath, function(exists) {
      if (exists) {
        res.sendFile(imagePath);
      } else {
        res.status(404).send("404");
      }
    });
  });
}

// app.get("/api/squirrel", squirrel, (req, res) => {
//   res.send();
// });

app.use("*", (req, res) => {
  console.log("ERROR Catch All -- Req Url:", req.url);
  // prettier-ignore
  if(req.url === "/") console.log("NODE_ENV must be 'production' Current:", process.env.NODE_ENV)
  res.send("404 - that did not go well");
});

app.use((err, req, res, next) => {
  console.log(`Catch All Error:======================================`);
  if (err.code != 11000) console.log(err); //11000 is a mongoDB error
  res.status(200).send("Something Broke, we're sorry");
});

function heartbeat() {
  // console.log("Heartbeat");
  if (Date.now() - heartbeatLast > heartbeatFreq) {
    heartbeatLast = Date.now();
    const date = new Date();
    console.log(
      `Heartbeat: ${date.getMonth() +
        1}/${date.getDate()} - ${date.getHours()}:${date.getMinutes()}`
    );
  }
}

setInterval(heartbeat, 10000);

app.listen(3000); //listens on port 3000 -> http://localhost:3000/
console.log(`Listening on Port 3000`);
