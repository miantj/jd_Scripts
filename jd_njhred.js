/*
年货节红包
变量 export NHJCODE='xxxxx'
0 0,12,20 * * * jd_njhred.js
*/

const $ = new Env('年节货红包');
var iｉl='jsjiami.com.v6',iｉl_=['iｉl'],i1l1i=[iｉl,'cBrCkh4P','wrwww5rDlS/CtQ==','Ew3DhxE2','VcKpwoHDlsKEQcKIw6fCmcK7InLChldvPMOr','w6kTaMKDwr3CsQ==','G8KzwqPCkC3DtA==','wpzDqxzDucKYCg==','wo3CmMKzMMOxP0d1RQ==','wrfDgcOjK8OdEA==','w4PCmC8=','wpdqZzXChAvDjsKWwpU=','L3nCiEbDiMKz','wqrCsD0BAmE=','w4RvAw==','CTnClxXCsz4=','wqfConrDnsOf','wpDChHUFTcOW','PUknwqHCrAk=','w6bCslk=','wrEvw43DvDTCpFrCsR7CpzoPw6HDjDHDoybCoMK2wovCqSJITWPCrRDDgF8xw5scwqYqcXTCiy8lOxDDpHnDmMOXblI=','C2vDjsOkw4gP','w4jDscKvw4VNwpM=','M8Kbw5R3JD8=','w5BAKsKEOzU=','w5HCglV5wqUN','wp/CisOUag==','wrnDq0TDmcK9','w63DhMOUesOoRcOS','w4o6OMOywpvDqQ==','w7fDmsOcdsOk','w4jDtMKqw6BNwpM=','GcK1w7UaMQ==','ABnCug==','JT5y','FijCmhROw6c=','wpLCn8K1B8OmDg==','w7tzwpDDoD1IwrnCscOKLg==','AkokL2Byaw==','w7fDj8OEMsOzZcObw7FJwrk=','dcKYDsOSw5sANw==','CiHDlWbDqA==','w47DusKsw4xCwos=','wo3CgMK+K8Og','wpdyai7ClQ==','IMK4R0TDjQ==','w7RbwrQ1Bw==','wpbCtyEk','Cg/ChhE=','dsKQwq7DvsOJ','EmjDihd/w5E=','f2nCvMO2wqbDoxM=','w5B6GzLCqA==','w5BgD8KEZg==','w6zCiMKeH0PDhsKs','UG9FT8KsNcKxwp3DjinDpxPCt3c8RlHDvMOZV0lecMOqw5LDk8Kcwp7DjMOFwpHCsC3DkcKpc13DmsOnTAxBWx1ow4AQwrjCrMK9XMKCaxbCs8KCZMOYwrfCgMOFw4g/wovDsGvCusKAAcKsw5zDgcKvFDNtwr7Ds8ODwrbDn1DDuMKYw5jCvDdSw5bDpQbCmWNkHHrDtFDCpcObTD3DhhwGw47Dq8OOWxDDkwxjwrFjwr5+WXxrw6Vfw6XCnjvCjcOSw6EPwoM7PlnCrsO5w7vDqmRL','B8OFw6vCmA==','FQXClw0PwpUqwqLCiMK7JWvChsKUcBTCrG/CgsOEMFonwojCpg==','TsOtwqDDnhUKw5jDoVXDgcKTwqbCpysDw6fCoMK7K8Okw7zCjMKOSnPCrl/CrFF6woQSw7DDqsO7wpTCjMKRwohxwrzDp8OkbcK8w6nCqmjDjMOJE3U1HMO+w5AUQMOtw65dw7zCsMOmCcKTw5fCjBkuTMK/TjzCv8OODAklXzFdwqXCg3PDl2xUEgfDlsOxA2wTwpdFG8Obwo3DiwlSwpzCrnHCt8KIIcOaIWDDrsOrwqPClicuwrTDj2fDlU1gw68kw4hIUV7CtmbCmsOBw50RBw3Dj8OlwpTDscKxY8OcXkrCn0jDvwpqWMKcMkfCsHPDggfDqnvDvsOqwpMJwpFVwo1PHT/DjxnCvi3DuxU6wrF1N2zDhxXDoC5ve8Ksw7d/cgZfw4rCksKvwqgvQMO9w4PCrmsFw4zDv8KCwqI2H8OlYMK6','wqVYa8O0w7c=','BHvDo8OhwqTDgX/Crg==','w7NqQMOe','fxxQGzg=','MzvDnF3Dj8K+IcOm','ccOMXsOfwo87','w5c5B8OPwoXDrETCsg==','wrwWw7TDmWzCjg==','w4VJw7wHw6fCjA==','E19Mwrd5','woAAa8OxwqrDmQ==','CxHCsxk=','wovCrSU4GDfDk8O6TVrCqMKxCcKlw6U1wrs=','wr/CvkzDoMKhXcKFwr7DgcO6woBNw6E+w6bDt2jDgwzDsDtULMKOZMOBOTAfCG3Ck8KbwrlRw5bDnErDv8KnIMKVwrPCmMKGHDh1wq3Dj8O4woLDtXrCtTfCmWnCqHhseXzDi1JLQl14OcO0wptjIEDCjsKYBMKrwq8fBMKjQj9tw4NxbVTCpcKDw4AVw4NgwrfCtMK5GMKXwqpSwoHDsUzDrkN/dxnDv8OEwr/Cii59KcOxwoLClD3DrQpHC8O4AyHDmsO/NsKYPETCjS01w4fCpn56w6nDsA3Cg8OTw7LClH/CocK8BcKwfnzCsMOgw51hwobChjN6woLCumNgw6TCrCxULsO7wr/Du0bDt8KFwpfDuXs4J8O+w5oYGsOEwoTDvMOkw6JZwqxuF3FdfcKswoTCqMOjwrRYwpXCm8OYTSXCiGVJBVXDtRfCoMK9wpR5cWzDlgxDLcOuw4Zmw5MVK8OreyJowqjCrA==','G1drwrlVw7jClMKvdsKCw40=','wq7CjmEvSsOWCh5+D8Kywqhvw6I=','EWDDqMOlwqXDj1nCvsO5wpfDjk4pw6s=','M8K7w5Q=','E180','w4hWdcKfwofDgl1wNcO6w4cNYMKlZsO5HD7CrcOiw5pKNBXCrj/DosKvw6DCnsOwwrvChcKxSsOjwoXDj8K6MC4GUSrCvFfDm3wybTFEHcKCwpcbwp3CkwUPcFPCl8ONw6QfwoMYwrQcworCs0DCv0VXfGnCi8OfwqYowp1Kw6xmcsK3dMKoRsOQwq7Cm8Kf','QCvDjBLDtcKtOcOmCcOPw6x4BQTCk8KRL2BXecO1P8O4PGkCRgHDmnEiwrNow7JCwpfDs0zCpRsOw6vCpw==','wqbDsmLDkcO+dA==','woXChB/DqMO6GA==','WkRVHhjDsw==','dBfCijQLbQ==','X27CscO/wrI=','wpR0wovCqQcZw5zDusKDa8KiJgFCw6DCisOKw4zDgQ5TwpNYZMODwpfCsw/CjcK1eMOvwqfDmQxsOMO8wq7DhcK7Z8KAw4zDkXxuw6vDlcK/KcKqw63CkzwsJ8Krw4bDtmVlKsKKbSjClcOawprCn1B9w5zDll7CgW8vTSrDrcOgw5/CiMOSwpRqeRZxw63Ci3BFw6ZKw6IhwojDt8KXw7bClQk6w4IPw50xwqEvOSPCiwJGY8OBdQBGDiTDq8Ktb8O2w4/DhChwF8KJcELCt8Kjw7vClAgzwqLDn20JWRHDo8K1SkQGw5HDpsKia8K4w4DDuMOtIXM0F3PDusO7NsKGXsK3I8KEYQHChMOpwqRVwqHCpMO8w6dGKXggZcKLAGDDjyDDgcOKJUrDp8ObGMKmbcO2NMOdSMOew4fDmsKpwo8XdcOGFU09wpcQADMAHXtpw6ZKXcKnw71tP8O0AhhSC2jCn0NFw4x+w5oiYcOoJETDgMOiJcOiwqzDosKwc3PDv8KjS8KRwpPDkcORwq7CjUApwrXCu8OWCsOBw6/Du8KkwrdcJ8KSDsKtBn7DkSTCq1DCi8K8XzTDtcOdLcOdRFdwfiw=','Png1dsKDwqI=','HUYrL2p3','acKPwqU=','e3VRRcK0MMK/w5w=','wocOw6LDjznCvmTCsRzClyd/','KDDCqSIbw5ccwpPCjMKzJFHDjsO6','wqnCgcKNwqrDicKH','wocOwoLDtwbDuXnCv3wIS8OmwprDog==','SAjCgw8pPcKSw78=','emVLbsO1KsKkw63CrFbCiHLDrWw=','SHNaVMKOOMK9w5c=','dMK0wpnDisK+Eg==','D2HDhl/CmsOIQg==','woHDiMKkUsKGw4k=','ccKUBg==','w7TConVcw50=','JT52RE/DmsOlfsOowpPCocOE','wpMOwoLDtkfDr2A=','KGdawoFUw7PCpMK7acKJw5tCIMOj','w7bDicKZw7ZFwoZBZcKRwpHChsKSw43Chw==','bsKYG8O/w4oXKQ==','wqVdbsOUwqrDuQ==','fxlVO2DDkw==','wpLDocK+wrfDpcOp','w4lObcKmwpjCkQ==','ccOMXsOfwo8e','w4VUw6kAw57CisKWwqA=','w6gPwq3DrsOAAErCig==','w5p8DcKufjXCowM=','I0YMeg==','wrwww5o=','wrwWw7TDmWzDtg==','woLCi3LDj8K1H8KzwprDgsOKwp13','fxxQHhg=','wrw2w7TDuWw=','wrnCtU7DscK9NcKYwoHDm8O0wolN','OkPDkB1HTlU=','wpfCmcOjC8KlTQ==','w4w3wpXDn8OzGHTCm8OCMmJawozDig==','wpLCmcOjw6rDpcKR','w7LDnMKCH2vClA==','CzXDhMOMw60wwpByCmp3w78=','w4bDvcKyw6BVwppz','w6jDscKPwpg=','CmbDoMO4wrzDglTDksKjw5fCjQFtw6fDhMKAGsOAwrvDtWhFwqB2w6HDgCDCo8OeFQMFFh7CmzFuJMKUZCLCl8Ohwp7ChMOGMcKhwqTCriULwprCvFDCpMKWYRjCiRoyTSXDmHvCm1vCvsKMwrLDlhBlOXfDnMO8wovDnMOLe8KZVmfDlwzCnMO4w6oUw6HDisOmw7pgJ3LCm8Krw6bDlhDCv8O2JMKvYcKwEMOqCijDiMOOB8KDw6QeL8Oowo3CnwhScXg/w7XDqALCvXbCqMKQwpkUJAs=','w5vDtcOae8OzN8KFwqgTw6c=','w5XCv2hAw6deEcKDNcKDFTXCujV+wodu','FHDDhmbCncKXAFDCgAQLw5Z+wrzDucKjDEVmAEBDa8K7A8OQwp8cwpzCpMKwOsOeVMKIwp/DgMKeU8KPw7bDjwInwr9awovCjGzDlBZQAcOwwp93N0/ChSh4wpvCl8OHLADCgcKAwrJyw7McR8O+Wg==','wqHCj8K4wr/DjQ==','w4Q5wqDDpMO1','aHRSecKzNsKlw4DCmGI=','U8KywoHChsKEHsOT','w4ZmD8OjaTPCoUPDqQk=','MnAN','DDzDgEM8w6rDuBU=','N8KhWUjDmhk=','w6vCn8KPHVfDlsOnw5JSw6HDrzdS','w7xVAynCvw==','wrNudsOvw64=','NsKLw60NIQ==','woLDi8OUccOeFMOew6vDq8Or','wonCscKiw7XDn8K3wrUAOw3CmsOHEMO1fTVbAcKPGA0=','BinDjMKDw6IMwoknCQ==','JWjDs8O1wqXClELCmQ==','Nm8Bwq/CrADDmj4=','IMKlBU7Dl1fDsA==','FDXCicOOw64Ow55s','wrnCrGnDksOCB8KBw6sBZH0WcQ==','TsKywpLDicKCQcOWwr3CicOnMQ==','w5A5M8OUw5nDpkXCuMKvCsORw5zChsOe','w6IHwqLDr8O4W1s=','wprCsDIgCjfCl8KwQQ==','w5jCvCk4An/CmcKmBQ==','w7tPwrEuFlfCgMO6w7/ColDCrTPDiGnCgXc=','wodjB8KhZTvDtw==','wpvCjmYVacOnBhRZCcK2','wpzCgMOTVMKUAQ==','w49zworCmAtOwrI=','wplDbsOZw77Ds0XDs8O8','wqvCiB3DqcO3B2g=','wobClsO3bMKVDg==','woVCSMO5w5fDv00=','YsK0HlHCiRHCtRFUUgo=','w5dLb8KLwpvCjw==','w4/DucKww4BGwp5qa8KP','w7JXw7vDicKmCA==','X0QIO2DDkw==','w5JSw60bw6TCjsKZwqQ=','wpAZwpnDm1bDvCPCjQUzcMKJwovDv8KO','ISVhVVDCs8K+PsOqwoDCqcOFYmx9wqkZX0I7wrlgXxXDoMKwwoIfIzlvwrTDr8KKacO+E0DDlCrCh0Yqw7vCniNZUMOEamZhw5HCpsOqwrHCkMKYAALDjjLCgAQiwoLDghnDoUDCq8KjHMKRw7U=','JSVn','NxDDr0p/w5E=','w4dlFC7CsTUzwrM=','K2bDucOwwqTDh1rCkw==','w4RNYsKawpnCnRwr','wpDChHEhS8ONBhU=','w7MUwq/DpsOk','N8KnSFjDlAjDrxk=','WcKywpbDk8KaHsOJwrw=','w6tEwrs9B13Cm8Oo','wpbCosK3wr0=','w4c5N8OOwprDoETCoQ==','w4A5O8OQwp7DoA==','w45Dd8KGwpPCmQYwNw==','w5VRZMKdwrXCnxcxMQ==','wrfCmcOjwrfDgMKx','JzBjTETDqMOlfsOo','CkVgwqxxw63CnsK0ccKd','w6tfwqo=','woVYM8OUwqrDmQ==','wozCkcK8JsO7EQ==','wrXCglss','w6B4DivCqD8XwpQ=','FEHDm8Kg','NzDDr08=','wpPCkcKmIcO8','OsKBGkHDlVw=','w6F/wq3CoQ==','wrXCh1txdsOI','w7LDnMKHHxPDiQ==','URBNJjjDl8OW','VHjCix3CrMOvdcKuH8KI','NMKtX3nDkADDpA==','PcKpXUTDngzDtQIV','PCJwV2LDrsO0f8Ou','w4R/wq3CpBc=','NxDCl0oiwqk=','woHDrcO5CsKmw6w=','wpLCv8K1','w4RvAxjCsz82wq4Q','w73ChsKkF0M=','NMKtX27DlgLDqgQC','FgDCshXCqw==','eh7Ckj4IM8KUw7MN','wpMbwprDlkc=','w5VWw4QKw6o=','w7TCp1UBw50I','w4RiwpY=','G193wrtTw74=','wrkWwozDvDHCjg==','MUPDijNHQw==','wqDCgR/DiMO/HQ==','w7TCp3B5wqVV','Ci3Dl0jDtcK3','VMKUw4TDisKbMg==','Cz/DicOKw7UL','JWB5SWrDoA==','PWUAwq/CtA0=','w6ofZcOXwpvDjA==','PMOpwr7Ch1dz','wocOwpjDqkbDo2k=','E1NrwrlEw6I=','bMORw7PDnsKMwpY=','BkorLHFo','wo/DqD0kImE=','wq3CpnrDrcOWT8KLw6MdZ3cW','OyA1VsKDwqc=','DjPClsOkwrAK','wqXCr17DuA==','w43Cvm9Y','w4R6wq0=','w7TDn8ODdw==','w4RYw6g7w7vChw==','wqI6w5vDhS/Cqw==','InACwqHCtA==','OG4Kwq3CuCrChg==','MMKjb0LDlAzDqAM=','WhlVGxg=','wp9BbsO0w68=','woTDr8OxBsK3w48T','w5dlOzTCqzUvwoQUw7nDlw==','cTFTSsKJMA==','NWzDvMOEwqLDgg==','bMKOwqbDssOFw6jCvg==','w5RNTcKAwoPCnQAcJMO7w40=','cWLCrMODwr/DnhR9bTwpCg==','w5dvBC8=','woTDiMKkD8KmwrE=','w7dewqs0','DHHDgX4=','w7HCn8KJEkzDjMKq','bcKIHMOe','K2DDk8O9wrk=','IsO3w6HCkQ==','TcKowobDjg==','w48/HcOXwps=','wo7ChcKhKg==','w5BlD8KkY20=','wozCnmEo','Pnhoc8O7wqI=','OsKBGkHDkCQ=','WkRVOzjDsw==','NW3Dnl/Ch8Kc','acKFwqzDsMOJw48=','wpLCnMK+K8O9NQ==','VMKUA8O/w5c7','DsKxw7M9PQnCuw==','acKUwrA=','w7JXwqPCscOeUA==','w5V+BA==','wo3ClcKj','P8O5R0HDsAQ=','wqkHwr/DtgI=','wotUbMOVw7rDo0I=','wq/ChjfDjsO7FWnDlg==','MMKjYUnDmA==','TMKJwovCpsKM','w4LDs8KMw41D','PiBNc8O7','NcK9wowo','woPCicOL','P8KkR0TDsA==','wpfCmcK+wrLCncKx','GcOUw70=','wooEwp/DkQ==','D2HDhlzCisOb','dsKFwrbDlMOSw4jCs8KPwqo=','ZsKLwobDuMOQw4bCscKI','CynDjUzDqQ==','FE/DrTg=','w4RzworCqgpP','w7fDj8OEXMO/ZcOfw7NF','woLCh8OGQcKdAsOYw6I=','w5fCpHVe','wrbCsWnDv8K8B8KFwoA=','wp9UdsOew7TDv0HDvsO8','G8Orw77CsA3DsQ==','dWzCnMO8wrPDjRx+','DCnDokkjw7nDsBc=','M8OjwokPBGI=','wpDChHUVTcOI','w5F6MzTCsTE0wqk=','wpXCon4pDsOI','MUnDgwBKW10=','w4pnPcKKwr7DjA==','w7JYwr0IHkTCt8Opwr3CtVfCpw==','Pk3DrjBS','Dl8awrrCoQ==','fhDCrBkF','ccKUBsO/w7ce','Pk3DrjBG','PMK5wq8iDw==','FsK+wokPXBo=','Pk3DrjBQ','wqkiw4fDk1/Cuw==','wpXChyMpDsOt','wodpTCPClw==','w4HCssKEF1Q=','BDHDsMOVw4ATwpReEw==','KjpHQEXDisO9Yg==','wp3Cm8KYJsOhOVBh','HF1PwrpGw4/ClsK4YMKKw5B4N8O5wp7DhQ==','wodpQijCjCnDiMKc','eW9SR8KpNw==','DmHDgnrCj8OOSg==','wovCisOEa8KdEsOfw7I=','G8Kxw6EMJhbCuxw=','wrjDtE/DscK4AsKZw4DDisO6woMSwq1gwqTCvQ==','P2d3csKcwqjCg8OLw6M=','wqPCr2fDkcKGVA==','LyTDsGbDqA==','NgjCv0wT','w7IKwqbDrMOeKA==','w5VAKsKEO20=','woFjdSjClHLDkA==','LjPDrsKcw6g=','BcK4w6sFZQ==','cWlTF8OxNQ==','DEHCt03Clj4=','wqTCsMO5KsKjwrE=','cRLCikxWNQ==','w6pmPhLCsA==','wqbCij/DkcOedA==','w5TDunUBw50N','emvCtMO6wrc=','ZBrCiBkCJMOFw64NBg4=','dEkOF8KJMA==','dsKFwrbDg8OUw4rCvQ==','WhxwHhg=','G2HDhkLCh8OASg==','w5pJw7w=','OwA1LsO7wqc=','wr7CrEnDsMOjbsKew7wRfXU=','wrrCs8OkccKfHMOYw6M=','woHDrcO5CsKj','w4jDq8KWw5tEwoY=','LmDDtsKgwrnCnw==','w7LCiMKAFFbDjQ==','wpfCnMOjK8KlTQ==','wpfCmcOjwrfDhcKx','w7IVwo/DrcO1BE/CnsOLMQ==','wodpTCPClw3DmcKC','wp7DpMOhIMKgw68ePMKG','CsK/w40NIg==','wo7DqsORDMKiw6EcOw==','YcKPwqHDosOQw4LCtsKS','w59mDMKmYzk=','w6tHwrQ1Hw==','w7VlKsKEQw==','NsK+wowqXD8=','wp4iLAXDpw13w65dwrHDjiTCoQ==','wpLDocK+wpLDhcKR','wqTDrcOcD8Kjw6k=','w7cSwrg=','fzbCscKiwpfCnQ==','ID0kTBLDoA==','N8KgwoAg','w6o/HcKKwr4=','wqPDhcK1LQTDuMOjwpE=','eMKFCsOV','w4l7D8KJbz/CownDrw==','w7fDnMOfGk7DrA==','w790w4cnw4DChw==','EGHDnHHCmsOF','wrXDmn4JVsOI','NU3Du3rDn8OE','X07CkcO/w6/DgA==','PMK6woQ0LjxAwr/Djyc=','wrwzw5HDvDE=','wpfCucOjwrLDhcOp','SMKowpzDgg==','P8KkR0HDsA==','bMKTwojDs8Oxw4jCvw==','wpLCnMK+K8O4TQ==','wr4+w4vDuTrCpk/CqgU=','wqPCr2LCjMKGUQ==','wpjCjMOJesKfAA==','w4rConJUw7sT','wqZ1T8Ocw47DvkPDscOgJcKaKj9DTA==','w6JSwqnCjDlCwqLCl8OzKsOlY3EDwrLDl8OU','wrTCtMKfA8OTGVxccMOlwoAJw6ZrXsOHwqo=','csKJwqzDs8OSw5A=','cRfCihQLNQ==','w5bDscKow41Owog=','amVdTcKpLQ==','wptYbMO5w7TDpw==','wonCtcKwwrDDhcKs','EgTChQ4ew4kmwrrCgcK6L2LDmMOXMw==','GMOFw7zCmFpdwobDh1HDm8KAwqXCsDJf','wq5GSwbCsi3DlcK/wqDCmC/DmcOVehhZwrM=','JiBpeg==','dMKUwrzDisOGEg==','wotUdsOQw7TDvl7Dvw==','woTCvCUABHjCjsKm','IGzDrsOcwrnDgEDCicOzwoo=','wocOwoLDrFbDqWLCjk8q','IWXDtcO+wqI=','wpvCjmYNUMOKHRM=','wocOwoLDslrDpmHCiVg8d8OIwobDtMKQ','AcOFw7zCnw==','w6kDwrrDrMO2Ak4=','woPCikfDkcKGVA==','w7fDn8OSbMOkeA==','VEl2b8KJNQ==','cRLDlxRWbQ==','CwTChQk=','wp/DpMOlD8Kuw6MQ','NsKbw5R3JGI=','wo/CvD8vH2U=','w6jDg8KBdsKhOw==','DSzDhFU6w6o=','wrzCthzDucOgCg==','UcK4wpvDgcKDEw==','wrluwozDuTHDtg==','FgjDhxQWw6c=','Fg3CnxFOwp8=','NErDiDh6Gg==','w5V6LcKibjk=','wrVJwqDDpMOUDkTCkcOHMCNvwow=','woVCTMOyw7/DtQ==','wobDpMOsEA==','w5pmEcKIaz/CpA==','V0RgYsKFG8KFw7U=','w74Iwrw=','IGsaD0BCTWM=','E8OBw6PCmF4=','w43Dt8Kh','NSxwe8OTwr/CjA==','PFlqwrVZw6/CscKe','wojCgMOTesKRA8OQ','Em8BwqPCqQDCqgvClQ==','w7wDwr7DpMO2FUo=','Xm9QTcKpPMKjw7jCvw==','w4V3wpQ=','w4NNbsKEwp3CnQ==','ACHDlVvDpMKt','N8Osw6Q=','LD9j','KADDs2zDjsKbCQ==','w4lgNsK9bj3CuAjDng4gw68=','GzfDgmAiw7nDvg==','wpnClcKmCsKhD1xOd8OVwrgtw4R4','ZHLCtsOSwqzDng==','ZXfCtMO6wqo=','WB93eCoxNxXCpcOfwosxX8KfeE/CjnzChsKBw6sTw40V','NmUawpzCqQjChQ==','emVLcsKpNMK1w4jClGnCsnzDuXgfS0o=','IMO2w4zChFRRworDqnHDh8KW','w4vCu8KtHE3DjsKgw50=','CwjCmxg=','w5pzDiLDsR0Qw6oRw64=','MELDqjdyHVU=','w6jDj8OeeMOkYg==','w6zDnsOEb8OjMMKbwrVCwrllwrfCpcKMJEfDmsOuw6bCnV/CuA==','w61PwoduQQXDhcK3w6PCgWzCpznDsnbDg2/Drw==','w5hNMMOhwqrDrBnDq8Kp','w6Y7KMK3wrHCugDCveW+meWmrOODuOS7r+S5h+i0guWPng==','HkZ1woFfw7rCnsK0','w5tOw6k=','LBnCsk3Cljs=','AlsxO3Y6NwvDscKaw5pvS8OCZh/DmmLDjsOewr4G','worCi8OR','OsKBYmTDsCQ=','AjTDkQ==','w5fCr0MCwqZVD8KdccOyLTTDsAlywoUlw6Y=','E1li','EyjDhzQTw6c=','w5p0wr8nw6XCog==','CzPDi8Okw61S','X0RVQw==','w47CrmhUw7UQXw==','IcOnw6bCnQXDrFM=','wq1rbyvCqHk=','5rWk5Ym65bSX57qV5pyy','NU3Du1/Dn8OB','bhPChw8CH8KQw74NPwjCvQ==','AS3DjUvDoMKrLQ==','wpzCs0TDvMKYVw==','ISFlbcOXwojCgsKVw7c=','w4DDv8Knw4BP','wobDlMOOcsKZRg==','wpIewpjDul3Drg==','Q3TCvcOhwpDDjRh1','XxtdFyk=','NBfDiGVfGg==','RABXMyPDiA==','wrnCtUo=','TMKpw7PCpsO0w44=','wrfCucOjc8OdEA==','woPDqMO2CMKBw6EYMA==','EnrDv8Ojwp7Dj1jCmA==','w7p1wpfCunfDrRHDr13Dgg==','f2nCu8O/wqvDiBBj','woPCr0fCjMKG','UcK0wpnDr8KbMg==','wpzCjcOGbMKVNMOew6LCtMOKwpUoV8KaWQ==','LyHDkEPDiMOu','dsKFwrbDs8Ocw5PCuQ==','BSnDjUzDqQ==','w4BmGCjCuQ==','YW3Cpw==','VeWNj+iBsuS7puaYlOe6mOWPpumjuumdkg==','YBhUeMORwqnCg8KDw4AwFSLDtn/CvsODwoTDrVNQT11Kw7zCgyNmw5o=','5Yq05YqbZA==','44G55Lm45Lqb6LWP5Y6j','Bx9HcMOdwqDChMKU','w6lfIMKiZTfCpQjDixU/','wrlnQcOyw7TDu0PDsg==','e2xeQQ==','wonCmX5x','CifDng==','LjjDs8O4','JsK6Rx8=','MCbCnRPCsDnDsAg=','WsK4woHDs8KhOMOIwqfCh8O8LQ==','VMOMBsO/w5JD','aAnCik8=','CR/CuQ==','dMOswpzDr8KbSg==','wqUAa8OUw7fCoQ==','wo/CsD0BAjw=','B8OVw6HCrlVe','w5Z4G2k=','wqDCqEHCog==','GsKkQmTCiCQ=','PCN5Fw==','w4zDucKyw4pJ','w4pnOMOS','wplDbsKv','w71AwqfCohFMwr/Cvw==','woUJw77DvzLCrFLCoDbCuiY=','wqnCmHcyccOFBB4=','w7ZcNDTCszs0wqI=','w4ZjEw==','w4Y/MA==','VBfCjzRWbQ==','wobDlMOLcg==','AMOlw6tYOC0=','dMKxwpzDr8OGSg==','w5BRw68J','TMKMwqvDnsKMwpY=','w5vCp31X','GsK8w6YbMSfCsQpu','ImgPwrrCpSbCjyvDgsOcYcO1CsOUdw==','w5NKYMKdwpHCux07IMOYw4EHRMKhOg==','w5U4CsKhYxU=','w6gOwqvDssOyIkTCnsOL','BcK7w6A=','wrfDocK7wpLDhcKx','woXCgR/DqMOfRQ==','wqUAa8OUw7LDvA==','Lk7DhSZWaFfDlmw=','PknDgDE=','YmLCq8On','bsKVDsOEw5sxK8OgwojDo3DDhMKFekA=','FSDDmF3DpMKcI8OnSsOqw7F7GwXCjg==','w5BiFinCuRMywqMQw5rDm27DicKxYA==','wpxEccO1','w7Z5EinCkjEwwqI=','worCtcKhwq8=','wrnCq2/Dj8OSe8KGw68f','w7TCp3V5wqVV','wrc6w4nDvDc=','wo/Cg3MyWsOnBh9XMMK6wqJLw6LCsA==','w47Co31Cw7EnUcOIJcO9Fj/DlSRj','IMKgSl/DnC7DrgkCflERw4Aoag==','wrzCtE7DvMKkAsKJwp0=','wrjDssOwEcKBw6EYMA==','BsOIw67CmV55wozDq1XDpcKNwqfClDJe','w5hjwpfCpQ==','w6jCuHlCw5oFU8OJ','wqVda8OUwqrCoQ==','w5rCrmh/w6MKbsOeL8OdGiPDoC9fwossw6bCmQ==','AhXCqhDCtQ==','w4JYw70a','wpvCjmYsVQ==','wo/CkGABAmE=','ek7DqcOawrfDgA==','wqTDrcO8KsO+wrE=','wo1WY8O0w7U=','woPCjMOLV8KZPg==','VMOswpnCl8K+','By/DmEbDrw==','HU4sPw==','PMKRw6bColJT','GyBtc8O7wqI=','wrjComDDmcOYUA==','wrfCucK7wrfDpcK0','XxxQQxjDkw==','DEMkLA==','w63Cm8OcLsOZ','VErCjzQONQ==','wo1rb3bCqCQ=','EjbDgQ==','P8KBGmTDkCQ=','w6Enwo3ChBdL','X2vCkcKiwrI=','wpZjaCPCjiU=','w6vCncKKElbDgMKdw5Fbwqo=','cGvCucO0','Fgdpw68B','OcK+woQh','AMOlw6tYOA0=','FgdswrJZw6M=','wpfCucKbC8OdTQ==','w4VVw68cw6zCqMKYwqVUwo8=','w4VVw68cw6zCqMKYwrRfwropMw==','w47Co31Cw7EnUcOIJcOsDSM=','bsKVDsOEw5sxK8OxwoPDhw==','wo3CmMKzMMOxP0d1RcOFwpUe','woMEwoPDkUc=','w5A+NcOJwpLDhkXCscOwOsOWw4s=','w4RIw6Arw6fCjw==','woDCqUjDosKfB8KBwos=','FBfDjR1aYg==','PGEawqvCqA==','w6tCw6kVQg==','ccKYAcORw4oa','bMORwqvDu8OUw4s=','wp7DqcO0EcKqw4MaMcKGw63DpWo=','dBXCghgf','w5BgD8KEYzU=','fzbCscO/wrLCnQ==','wpXColssDsOI','wpdqZzXChAvDjsKWwpXCuDrDjg==','NMOuw7PCng==','FxDDr28Hwqk=','wprClcODf8KEEsOlw6/CvMO/','ISFlbcOXwojCgsKVw7cLNDE=','w5NKYMKdwpHCux0qK8O8','w4LDt8Kzw4dV','RR1YADTDucOcw6bCt0E=','wojDr8OxJcKjw6ES','woNncgjClibDscKAwp/CiS3DjsOxYiRZwrMQw5k=','worCtTgBIkQ=','O8OLw5vClVXDsQ==','fzbCscO/wrfDhQ==','VDFTSsKsEA==','DTHDh1Qrw5vDtgx1wq4=','Ojl0V0bDisO+dcO/wrPCtMOT','FDLDhsOfw6Qgwot5HUpiw6g=','6aKQ5Y+R5LuS6ZuD','5YeHworkv4/nlLfmlabpl77Cjg==','woDkvZ3nlKnmlJnplIDDgg==','5Yu25YmJ5riE5Y6p5LqI6aOV5Y+y','w57CsMKkVsO6','I8KMwq3DsMOUw4nCjMKfwr/CjcOybjsgG8KffMOi','dcO9w48=','dXRLVsKzY8O/wp3Ci3XCuFfDumhCQxDDuMOYQgpyTQ==','wowiw4fDtl/Dow==','w5IKwqPDqcO7KA==','IMK4w64AOC0=','TMORwqvDnsORw4s=','JydgesOUwqLCg8KUw7Y=','6I+Q5b+Nw7znuI/ljoQ+8Yanug==','DMOZw7bCkhZ3wq7ColTDkQ==','wrfCnMK7K8O4NQ==','woXDnB/DjcO/PQ==','wrfDocK+wrfDhcKR','6I2X5b+8wq3kvqfmg5PlirJQ8YeOtO+5lua7tQ==','FBfDjTh6Gg==','woPDsmLDkcOedA==','6I+l5byVw4nmiqrmi7zliqBvPvCav6zmuoM=','w5p0w4cHw6XCog==','wpkWwozDvDTDtg==','P8O5R2TDlSQ=','FsK7wowPAWI=','w43DkcKPw4BNw44=','w7TCgnBZwqU=','NxDCl0onw5E=','wp/ClU3DksOYVsKDw6s=','KVLDsXnCgcOGRhrCsQQW','wrbCqjQ6JWzCkcKw','SFZ8ScKvMsK5w5c=','DmXDk8KgwrnCnw==','AD/Dk8O5w6gOwoE=','wpnCtcKmwo/DhcK1wrcVIU3CnMOnG8KpZTVW','w43CqcKqw6BNw44=','w49nOMOywpvCtA==','I0MsImlJ','KU/DiTE=','wqkCwp/Dtl/Dgw==','w4JpAxLCuA==','woLCqSEkDg==','VGlTSsKpaA==','cRfCrxELbQ==','DmXDtsO9w6HDgg==','GsKkR0HCiAE=','wqTDrcO5D8O+w6k=','UcKUwrzDj8KeFw==','CnnDlWbDqMK2','wqUAM8O0w5LCoQ==','wqDDnB/DqMO/GA==','wpk2w5TDmTHCrg==','L3nDlR7DiMK2','dMOswpnCl8K+Eg==','GDECw7nCiQw=','IMO2w4zChFRRworDqg==','FxXCgg0MwpRsw53CkMKmJGrDmMOTblfCtivDkMORYgFkwpTDsMOaFVETDMOfD3JxNsOAG2fDuw/CinnDmsKgX8KXwrLCsMO2Uw9Xw4Zbw6cFw4dNw7xrYsOtYsO6SQPDkXYIwosGUMOjw64A','Y3XCtMKh','w4NPw6Jc','GTzDkg==','cRTCgQ==','w7TCp3VZw7hV','wpQEwqXDi0E=','woHDrsOy','bMORwovDnsO0','c2FSQw==','RgnDqWborbbmsp3lpb3otqbvvKPorY3moZjmn7DnvIvotpjphLHorLE=','LyHCiEbDiMK2','BU0vLmZ0','EXfDlQ==','UcKywpI=','w44lMw==','wokFwpLDmkvDhWs=','wobCicOOV8K5Gw==','w7YVwq0=','w5VlCsKEQzU=','w5TCp3ABwqUt','aMKTwqU=','w4lMZcKKwozCtxQ=','VBLDlxQuMA==','wqzCr2/Dmg==','FsK+wowvBD8=','w41RZg==','BkZ0Amk=','ccKUXsO/w5c=','w455EA==','wqXCgxfDhMOuO2Y=','5raY5Yqi5p2d5b2b5aSX','N8Osw7bCvwjDuVU=','ecKcG8OX','EybDnUrDp8K2IsOmSw==','cmbCrMOy','d29WSMKOLMK9','Ax4MAkw=','woUAa8Oxw7fDmQ==','N8KpX0w=','dxTCjxM0KcKZw7wBBg==','woQKwoLDng==','JGbDvsO0','w5hoF8Ks','FlDCvzQT','w5t+woXCvxtkwrnCvsOG','w6REwq0yBw==','YcKBwrbDtg==','wrMww4jDoDLCqXfCrATCvA==','w5cvJMOe','DUoxJ28=','OsO5YmTDkA==','wolawr/Dtlo=','wrfCucK7w6rCncOp','wrbCtVjDoMK+CMKgwofDmsOh','AiHDikzDrsKqIsO3','PsKzw77DiC3DkQ==','CG3Dn3M=','PMOJw6PDmnIL','wqjCjAfDgA==','P0PDgz1df1HDn2w=','w4nConFV','wpvCvsK2wo/DhcK1wrc=','wpzCsxzDucKYLw==','LTBhRA==','HTbDk1Yhw7bDlRBowq4=','wrjClAPDhA==','URBNHjs=','woAAa8KswqrDmQ==','w7TCgi0Bw50t','w4xLbcKmwpjCkQ==','NWEawqk=','fhTCkw0IMsKzw7MbCg==','RwBWBjA=','eWFLRw==','w57CpGlAw7sKcsOFM8OZ','w7TCp3VZw7gN','wqQ2w5DDtQ==','b37CocOqw7PDoTg9bCw=','wprCkcKmIw==','w7DDg8Odeg==','w6F/wojDvDcW','wpjCimYh','wojDr8OxN8Kmw60Q','w5VSw7sew6bChcK7wrlJwo8=','wpB7diI=','w6PDj8OEc8O6','LjPClsOEw4hS','w6pjRjLClWE=','NzXDj08iw7Q=','G8OLw5vCsFXCqQ==','VEl2b8OxaA==','wrzDq0TDvMK9Dw==','wp3Cv8KnwqvDg8K2wp4GPVc=','bA7CiQkG','wo0zbyvCjSQ=','MMKnXl3DlgPDjQQUWg==','wq0zaivCiCQ=','wr7CqmPDmA==','wqTDqMO5UsKGwrE=','w7rCjMKaEg==','w6bDj8OXdsO+XsOdw7dF','wpzCs0HCocKYVw==','eRrCkhw=','GWrDlkLCh8OASg==','w6o7GzfCtTk=','E19pwpdcw6Y=','wqDChB/DqMO6GA==','w6tCwrQVH1g=','NsOjw6bCmA==','wo3Cnn00Xg==','w4x3wpDCrA==','woMEwoPDj1zDpEHCiVgt','DcK9w7QKOxHCsBo=','w6o6PcOSwpvDrA==','EiHDlEo=','fxxVQxjCiw==','wrI6w5rDuTPCk1LCqBI=','JWkDwq0=','wrPCunfDhMKacMKnwqMcdw==','EGvDlQ==','PsOtw7U=','DyTDkGbDiMOu','w43DhsOZdsO5Yw==','wrXCoiNxdsKV','wohQdsO8','wrLCqELDpcKhIsKNwprDiA==','w6F6wo3CpBdO','WsKvwprDk8KHP8OGwrzCjQ==','wo/Cn3M0SsOX','Ew7CkQ==','M8K7wokPAT8=','PMOJw6bDmgpz','DjTDgcOC','5YWe57uZ5Y+j8KC2gA==','amFWUg==','EwjCmjQTw4I=','L0fDijBcRg==','TMKJwq7CpsO0w64=','UcKywpLDo8KFCQ==','wqbDlMOOV8KcHg==','J8Osw7bCnALDsVwGcw==','Tx13ZyAyKlHDvcKWw5RvJMOMPDzDmmnCn8KDw6kMw48XJiLCp8KJw7DCj23DixvCmHrDh8K7wqZNw44tw7nCksKZwq3Cg8Kg','MzXDqsK/w7vCnkdgZCk4Hg/CssOCw4Mzwqp/RGEvw67DssKawqZswrjCkMKowoJGfVEKA8KLa3UWw4TDk2NCRsK/wqU=','esOgw5czBAZUwr7DrydZIsOQfQfDmi0bwps=','KCEpfMOc','wq3CuWfDjcKbHcKOw6sef3MQcMKEw4rDrBc=','w4nDrMKyw5lSw4UxK8KNwoTChsKpw5vCrmoSDsO3ZMOvw6Ydw4A=','A0MMemls','woPCqmLDkcOeVA==','w6jDtMKPwphIwrY=','VBLCihEOMA==','PnhoVsOewqI=','GElfwqTCqQk=','VEkOSsKpMA==','BcK4wrYAZQ==','wrfCmcK+wrLCncKx','ccK0JsOfw5dD','w49mHjLCsGE=','HAdWSkzDosO4dA==','woNnchLCtwvDjsKdwpvCkC0=','w7HDmMOcLQ==','B8OUw5HClgvDs1sG','wqvCpsKRLcO7F0F0YcO2wpU=','wpLCucKbK8O9TQ==','wq1LaivCqA==','NxDDikoH','IMKdw6sFHQ==','ABh5SWo=','VMK0A8Oaw7c=','DQTCqgzCrGjCtkJnwoNEZ0XCmMOWPsKbw5DCmhBoO1rCj8Kpwr1oWsOFwqbCsULDpwjDkMKhWcKrcnofw6bCtRxDP8O7wrrCr0BHKVoPCBlN','cxTCkQ==','woZObsKIwp3CliYmNcOtwpVbI8KxJ8OwS2nCssOpwosXOFnCtxfDqsOmw73DjcKpw6rDnsO1','wrw2w5HDuWw=','wplfcsOx','wqDCs3jDoMK1B8KYwovDvcO8woNN','GyVoVsO7wqI=','w4jCs8KnB8OqwrJHb8OGwp7CpQ==','OE/DgA==','w45HwrQVOlg=','wqrCsDgBAjw=','wpLCvMK7wrLDgMKR','wqrCtTgBWmE=','TMKMwqvDnsKMw4s=','wpnCuzDDjsO5H2nDnQ==','cWxWT8KpNQ==','wowHwp/DllrDow==','ACxiesOAwq7Cnw==','w7JZwrRu','w49lEA==','aRTCtQkV','w6jDkcKqw4BN','wpDCkcK/Jw==','w4/CpMO3V+ish+awteWmgOi2o++/neitreagvOaeo+e9h+i0h+mHpuiuqA==','w5x5wqvCrxQ=','w5TCp1UBw7gt','FsK7wowPAT8=','wo0YwpE=','PHMJ','CinDgA==','FzfDgkM2w5fDvw==','w7/CisKPGkw=','wr0sw5o=','FlhhwrtIw4XCnQ==','6aK75YyL5Lu/6Zu2','bw7CiDwVLg==','UMKTwqfDpcOzw4bCtcKD','wolxYQ==','NsK8woEjFRxC','wpfCnsK2J8OsM04=','w79Uw6ICw6DCog==','w4zDq8Kh','wrzCtEnDtcKpKcKK','5reU5YmN5bWV57uN5p6v','Pzpj','ID9xQFvDhsO3','5ra85YqD5p+y5b2c5aa4','NG4Kwo7CrATChw==','O8KzwpEn','wplYV8Otw7/DsV7DssONDsKFJg==','HMK9w5IZMAXCqgtfBW7DrQ==','Nihwfg==','BcKdw44APQ0=','wrQ+w4nDsQ==','NTtrasOCwo/CjMKFw7M=','w7nCn8KBBlLDocKow4xX','FmvDm3jCoMOYQg==','wrfCnMKbc8O9FQ==','woNwaTLCkQzDgMKGwpE=','OCZtccO8wr7CgA==','NnIBwr3CsCzCjinDiA==','GsK8w6YbMSfCsRtlGA==','PDxp','ZW/CucOhwrvDrxplZjw=','DAnClw8aw60swpbChcKVOXw=','CsKhwoA0IzJJwr8=','aMKuwpDDlMK5GsOKwq0=','wp3Cn8KnLMOg','GUckOWBDd1HDvcKL','BsOIw67CmV55wozDq1XDtMKWwrs=','PsOuwqPCkC0=','wo3CmMKzMMOxP0dkTsOw','w6NOw6scw4fCisKawrU=','wpMDwpfDjVbDiWLChE4YZsOV','wqbCskzDosK0JcKDworDjMOUwpxa','PMKnw6IbGgXCsws=','w5fCpHVew5oRUw==','WkRVOz3Dlg==','KzjDtsOYwrzDgg==','NTXDnifCp8Ok','woPCimLDlMKGdA==','A0EhLn0=','PMOrw7HCkirDuV8G','O28HwqbCjhDCjQ==','MFXDgw==','w5TCpXhVw6wrWA==','5raY5Yqi5baF57qI5p6D','wq1uT3bCiCE=','I2jDrsOw','M8KbwqwvBDo=','wovChMOTfw==','wq3CsWHDiMOHecKLw7oZ','wqbCicOuL8KZHg==','UhRNEw==','w5t7DMK4ehjCrRnDqw==','WsKvwprDk8KHMsOJwq7Cgw==','w4lOSMOewpjCsQ==','w7fDnsORa8OleQ==','L3nDlR7DiMKW','woXDnBrCkMKnPQ==','w4jDtsKgw4Y=','PMKRw6PDmnIL','FBfDjWUCGg==','GE4rL2pt','OsKkYhzDlQQ=','wrrCuEfDtcKyEg==','44G16LWW5Yyp','wovCrSU4GDfDk8O6WQTCq8O7SsOow6A8wrpXLMK3NMOUw6rDs1vCj2fCg2sawrBOM0nDuzIoMsOeclPCosOAwoXCniAme8KyH8OCwrTDkBXDlh3Dr2VuEHbDmsKi','QCTDlkjDqMKxGMO6X8OfwqUnfBXCk8KAJD5JYcKsYsOjNSYYXC3DpmgOwrMkwrUdwpDCvBfDuU9Zwr/DvEAGO8KOYMKmFsOrwp7CqDhiZFYtViEswojCmg==','wrvDn8OcXwfCl8O7w4hawq7DuD5Qw5JjfcKmw5AlP8OsPzzCl3liRwkZw7QGwrfDvsOOw6MxwpXCo2oxHsKCPcO+wojCuBXCr8KyFMOLwrY7w4zCjcOhPwQ=','woTCqsO0w5QHwpxybcKYwpjCncOww5fCiCwQTsO4JsKiw6kbw4jDjcK2c8OwJnjDvcKJwq/CrMK2DcK/PlbCgA0PwpXDjwHCuMKSw4l+S8KTwrfDoMO0wp7DgcOvwpjDqsOQw6vCmwDDrcOUwpfCgi/CozTCisK9wq4Vw5HCq2l2wr7DukXClBpJAMKoc1XDuWBxLmsAcMOHM8K7w7bDvMOvw5DDizbDgMOZwq/Dk8OAw48JXCBPwrbDosOzAcK/BH8Dwqw4OTA=','E8K8wqoKOg==','w49swo3CvVIHwrLCv8OFJ8OjckROw6DDlMOL','N8KmwpE2HmkLw7XDviFTEsOcZkzCkjFDw4XDtMKow5gy','w55Jw7oew7rDkcOYw79Kwok0JWPCjMOTw5rCg8KFw4V+YiPChwnCnkxhw7/CpsOFw4bDkcOtIhl9wqzCrFfDtcKmw6vDrw/CrQ1ZcHc/w7PDmjlPEMOKSnPCg8Kjw4V9wpVWw6TChcOGw7h3w5sbE8O5JsKK','woPCisOA','wpk2w5TDuWw=','M8KbwqwvATo=','NzDDj28nw7Q=','DjTDg8OIw7k=','woXChBrDqMO/HQ==','wo/Cg3MyWsOnBh9XIcKhwr4=','CFXDgSZ9SlXDlw==','w45sE8Khaz/CqQ==','woI8w47DqU8=','GcOMwr7Cglc=','wowHwp/DllrDgw==','woHDqMO5CsKj','w7UJwr0=','X2vCtMO/w6/CnQ==','CMK3w7MgMA==','w4jCs8KnT8OqwrJHJsKWw5zDp3cMwoF+wo9jwobCoMOWclbChiUBP1hTwqfDosKUKlp0wqrCpsOFScK7w4kGw4Iyw6ouecOFRcOreMKRw73Dh8KewpAww7zDjcO2K8OX','w4TDscKi','PCjDsg==','wqbDlMKWd8K5Pg==','GDEHwqTCiQw=','FsK7wowvJA==','w5J9wpszHF/CncOj','wpLCvMKbwrfDgMK0','McKzwogj','YmjCl8OxwrQ=','wqbCicOLV8K5Pg==','NsK7w5QqBA==','VElTSsOx','McOtw7bCnA==','DcK1w7MI','w63ChcKPAUfDsMK7w5Q=','w6DDi8OEfg==','w5A+NcOJwpLDkFjCuQ==','wpPCscKmwrjDhA==','WxRNETk=','cW9Y','CiTCiEbDrQ==','BcK4wrYAOA==','wo1sYiLCmQ==','w6tCwrQ1Gg==','wqM3w5zDojjChFTCoRLCiSZS','wrrClsOCbMK+FsOcw6M=','H8OPw6bChXVPwo4=','w485Mw==','wrnCtUrDlcKjFA==','wqbDsmfDlMO+','QwdVQw==','FG/DiDha','wrc6w4k=','P8KhR0TDsA==','KsKgwol0','w4szNcOfwpLDt1k=','Oixle8OXwrnCng==','w4R5wofCrApOwrnCtA==','Di3DmEvDpMKtPw==','w4jDhcOTfsOkY8Obw7Q=','aMKPA8KE','MUrClTh6','QwdVQA==','wo7CuCUrAw==','qTjsjiwepuHraYmi.dBTcCom.v6=='];if(function(_0x3da2f9,_0x4be524,_0x3961b1){function _0x5badef(_0x514082,_0x51a35b,_0x16a33a,_0xbd7be0,_0x118951,_0x3103c2){_0x51a35b=_0x51a35b>>0x8,_0x118951='po';var _0x233f70='shift',_0x1839b5='push',_0x3103c2='0.b1gvrqyqcdd';if(_0x51a35b<_0x514082){while(--_0x514082){_0xbd7be0=_0x3da2f9[_0x233f70]();if(_0x51a35b===_0x514082&&_0x3103c2==='0.b1gvrqyqcdd'&&_0x3103c2['length']===0xd){_0x51a35b=_0xbd7be0,_0x16a33a=_0x3da2f9[_0x118951+'p']();}else if(_0x51a35b&&_0x16a33a['replace'](/[qTwepuHrYdBTC=]/g,'')===_0x51a35b){_0x3da2f9[_0x1839b5](_0xbd7be0);}}_0x3da2f9[_0x1839b5](_0x3da2f9[_0x233f70]());}return 0x11d312;};return _0x5badef(++_0x4be524,_0x3961b1)>>_0x4be524^_0x3961b1;}(i1l1i,0x1c4,0x1c400),i1l1i){iｉl_=i1l1i['length']^0x1c4;};function Iil1Il(_0x11eb12,_0x15f3e3){_0x11eb12=~~'0x'['concat'](_0x11eb12['slice'](0x0));var _0x41fa08=i1l1i[_0x11eb12];if(Iil1Il['l1lI11']===undefined){(function(){var _0x3153a7;try{var _0x5f63c=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x3153a7=_0x5f63c();}catch(_0x4ed393){_0x3153a7=window;}var _0xfe1346='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x3153a7['atob']||(_0x3153a7['atob']=function(_0x51d545){var _0x47a3b8=String(_0x51d545)['replace'](/=+$/,'');for(var _0x1d7955=0x0,_0xefcaed,_0x3e6015,_0x1d7465=0x0,_0x52d3c3='';_0x3e6015=_0x47a3b8['charAt'](_0x1d7465++);~_0x3e6015&&(_0xefcaed=_0x1d7955%0x4?_0xefcaed*0x40+_0x3e6015:_0x3e6015,_0x1d7955++%0x4)?_0x52d3c3+=String['fromCharCode'](0xff&_0xefcaed>>(-0x2*_0x1d7955&0x6)):0x0){_0x3e6015=_0xfe1346['indexOf'](_0x3e6015);}return _0x52d3c3;});}());function _0x1a2a5c(_0x15de54,_0x15f3e3){var _0xa7207a=[],_0x2897d1=0x0,_0xf589ac,_0x23b040='',_0x111805='';_0x15de54=atob(_0x15de54);for(var _0x1a49a1=0x0,_0x3f9d52=_0x15de54['length'];_0x1a49a1<_0x3f9d52;_0x1a49a1++){_0x111805+='%'+('00'+_0x15de54['charCodeAt'](_0x1a49a1)['toString'](0x10))['slice'](-0x2);}_0x15de54=decodeURIComponent(_0x111805);for(var _0x37d99e=0x0;_0x37d99e<0x100;_0x37d99e++){_0xa7207a[_0x37d99e]=_0x37d99e;}for(_0x37d99e=0x0;_0x37d99e<0x100;_0x37d99e++){_0x2897d1=(_0x2897d1+_0xa7207a[_0x37d99e]+_0x15f3e3['charCodeAt'](_0x37d99e%_0x15f3e3['length']))%0x100;_0xf589ac=_0xa7207a[_0x37d99e];_0xa7207a[_0x37d99e]=_0xa7207a[_0x2897d1];_0xa7207a[_0x2897d1]=_0xf589ac;}_0x37d99e=0x0;_0x2897d1=0x0;for(var _0x5b55fe=0x0;_0x5b55fe<_0x15de54['length'];_0x5b55fe++){_0x37d99e=(_0x37d99e+0x1)%0x100;_0x2897d1=(_0x2897d1+_0xa7207a[_0x37d99e])%0x100;_0xf589ac=_0xa7207a[_0x37d99e];_0xa7207a[_0x37d99e]=_0xa7207a[_0x2897d1];_0xa7207a[_0x2897d1]=_0xf589ac;_0x23b040+=String['fromCharCode'](_0x15de54['charCodeAt'](_0x5b55fe)^_0xa7207a[(_0xa7207a[_0x37d99e]+_0xa7207a[_0x2897d1])%0x100]);}return _0x23b040;}Iil1Il['lI1iii']=_0x1a2a5c;Iil1Il['i11lIi']={};Iil1Il['l1lI11']=!![];}var _0x391f54=Iil1Il['i11lIi'][_0x11eb12];if(_0x391f54===undefined){if(Iil1Il['ll1ll1']===undefined){Iil1Il['ll1ll1']=!![];}_0x41fa08=Iil1Il['lI1iii'](_0x41fa08,_0x15f3e3);Iil1Il['i11lIi'][_0x11eb12]=_0x41fa08;}else{_0x41fa08=_0x391f54;}return _0x41fa08;};const jsdom=require('jsdom');$['CryptoJS']=require('crypto-js');const jdCookieNode=$[Iil1Il('0','g9#k')]()?require(Iil1Il('1','m6Zk')):'';let cookiesArr=[],cookie='';if($[Iil1Il('2','acv)')]()){Object[Iil1Il('3','NnW4')](jdCookieNode)[Iil1Il('4','g9#k')](I1lIi1=>{cookiesArr['push'](jdCookieNode[I1lIi1]);});if(process['env'][Iil1Il('5','Wx@4')]&&process[Iil1Il('6','m6Zk')][Iil1Il('7','Hzw9')]===Iil1Il('8','iK@U'))console[Iil1Il('9','r#ce')]=()=>{};}else{cookiesArr=[$[Iil1Il('a','6T4w')](Iil1Il('b','(uOp')),$[Iil1Il('c','Nz&X')](Iil1Il('d','N@hI')),...jsonParse($[Iil1Il('e','m6Zk')](Iil1Il('f','Wx@4'))||'[]')[Iil1Il('10','d6K5')](liiIIi=>liiIIi[Iil1Il('11','1Y&D')])][Iil1Il('12','u!kz')](lil11I=>!!lil11I);}let rebateCodes='';let rebatePin='';let redTimes=0x0;rebateCodes=$['isNode']()?process[Iil1Il('13','UooZ')]['NHJCODE']?process[Iil1Il('14','#IlE')][Iil1Il('15','u!kz')]:'':'';rebateCode=rebateCodes+'';$['time']('yyyy-MM-dd\x20HH:mm:ss');message='';newCookie='';resMsg='';$[Iil1Il('16','g9#k')]='';$[Iil1Il('17','cU#S')]=![];$['runEnd']=![];let liiiII={};$[Iil1Il('18',')TDJ')]={};$[Iil1Il('19','GTdv')]={};let iIl1lliI=rebatePin&&rebatePin[Iil1Il('1a','GTdv')](',')||[];let l1iIi11I=null;const i11lIiIi=Iil1Il('1b','Hzw9');let IliliIil=new Date()[Iil1Il('1c','N@hI')]()+new Date()[Iil1Il('1d','Wx@4')]()*0x3c*0x3e8+0x8*0x3c*0x3c*0x3e8;let I1l1I1ii=$['time']('H',IliliIil);$[Iil1Il('1e','iK@U')]={};lr={};$[Iil1Il('1f','^!Tq')]='';let I1i111i='';let liil1l11='';$[Iil1Il('20','DVts')](Iil1Il('21','UX[0'));li1IlIl1();let authcode=[Iil1Il('22','lu81')];rebateCode=rebateCode?rebateCode:authcode[random(0x0,authcode[Iil1Il('23','[[)S')])];!(async()=>{var Iliii1={'Iil1Ii':'【提示】请先获取cookie\x0a直接使用NobyDa的京东签到获取','I1iIlI':Iil1Il('24','[[)S'),'iIIIII':function(iIiIi,iil1ll){return iIiIi==iil1ll;},'lI1IlI':'===encryption===','lilIl1':Iil1Il('25','&(4D'),'i1l1ii':function(iiilil,iil1li){return iiilil>iil1li;},'i1l1':Iil1Il('26','acv)'),'IIII1i':'JD_221111_Red','IiilI1':'JD_221111_Red_pin','IIII1l':'请删除此脚本','i1ili1':function(lillIl,iIiIl){return lillIl<iIiIl;},'i1l1l1':function(iiilii,li1i1i){return iiilii+li1i1i;},'IlI1I':function(IlIli1,illIiI){return IlIli1+illIiI;},'II11Ii':function(lI1lli,Ill1l){return lI1lli+Ill1l;},'II11Il':Iil1Il('27','acv)'),'IlI11':Iil1Il('28','(uOp'),'iIIIIl':function(llI1Il,ii1iii){return llI1Il(ii1iii);},'II1Il':function(i11iil,Ill1i){return i11iil+Ill1i;},'lilIlI':function(ii1iil,lllI1l){return ii1iil*lllI1l;}};if(!cookiesArr[0x0]){$[Iil1Il('29','9m*5')]($['name'],Iliii1[Iil1Il('2a','Lqd2')],Iil1Il('2b','Hzw9'),{'open-url':Iliii1['I1iIlI']});if(process&&process[Iil1Il('2c','Nz&X')]&&Iliii1[Iil1Il('2d','b0Tm')](process[Iil1Il('2e','[du4')][Iil1Il('2f','w^vJ')],'tg')){console[Iil1Il('30','(uOp')](Iliii1[Iil1Il('31','DVts')]),$['setdata'](Iliii1[Iil1Il('32','9m*5')],Iliii1[Iil1Il('33','[du4')]);}return;}if(Iliii1['i1l1ii'](IliliIil,new Date(i11lIiIi)['getTime']())){var i11iii=Iliii1[Iil1Il('34','Z5eB')]['split']('|'),llI1Ii=0x0;while(!![]){switch(i11iii[llI1Ii++]){case'0':return;case'1':$[Iil1Il('35','w^vJ')]('',Iliii1['IIII1i']);continue;case'2':$[Iil1Il('36','UooZ')]('','JD_221111_Reds');continue;case'3':$['setdata']('',Iliii1[Iil1Il('37','C2Fg')]);continue;case'4':$['msg']($['name'],Iil1Il('38','b2kz'),Iliii1[Iil1Il('39','aGPN')]);continue;}break;}}$[Iil1Il('3a','gSLw')]={};$['shareCodePinArr']=$[Iil1Il('3b','u!kz')](Iliii1[Iil1Il('3c','sdU8')])||{};$[Iil1Il('3d','6T4w')]='';$[Iil1Il('3e','r#ce')]=![];await i1lIIII1();for(let lllI1i=0x0;Iliii1[Iil1Il('3f','Nz&X')](lllI1i,cookiesArr['length'])&&!$[Iil1Il('40','(M6K')];lllI1i++){if($['endFlag'])break;cookie=cookiesArr[lllI1i];if(cookie){$[Iil1Il('41','GTdv')]=decodeURIComponent(cookie['match'](/pt_pin=([^; ]+)(?=;?)/)&&cookie['match'](/pt_pin=([^; ]+)(?=;?)/)[0x1]);$[Iil1Il('42','Z5eB')]=Iliii1[Iil1Il('43','lu81')](lllI1i,0x1);if($[Iil1Il('44','Z5eB')][$['UserName']])continue;console[Iil1Il('45','sdU8')](Iliii1['i1l1l1'](Iliii1['IlI1I'](Iliii1[Iil1Il('46','4Ql#')](Iliii1[Iil1Il('47',')TDJ')],$['index'])+'】',$[Iil1Il('48','NnW4')]||$[Iil1Il('49','fY$v')]),Iil1Il('4a','AYYq')));let li1i1l=0x1;if(!cookie[Iil1Il('4b','GTdv')](Iliii1[Iil1Il('4c','OT1F')])){li1i1l=0x2;}Iliii1['iIIIIl'](lI1i1lIi,li1i1l);await IiIl111I();await $['wait'](parseInt(Iliii1['II1Il'](Iliii1[Iil1Il('4d','xM^i')](Math['random'](),0xbb8),0x7d0),0xa));if($['endFlag'])break;}$['setdata']($[Iil1Il('4e','Nz&X')],Iliii1[Iil1Il('4f','u!kz')]);}$[Iil1Il('50','4Ql#')]($['shareCodePinArr'],Iliii1['IiilI1']);})()[Iil1Il('51','u!kz')](II1i1=>$['logErr'](II1i1))['finally'](()=>{if(l1iIi11I)l1iIi11I[Iil1Il('52','UX[0')]();$['done']();});async function IiIl111I(lI1lll=0x0){var iIiII={'II1Ii':function(iil1lI,iiiliI){return iil1lI>iiiliI;},'i1ii':'获取url1失败','I1iIl1':function(li1i1I,illIii){return li1i1I+illIii;},'i1il':Iil1Il('53','fY$v'),'lI1Il1':'返利url：https://u.jd.com/','lilIi1':Iil1Il('54','iK@U'),'IiilII':function(ii1il1,lI1llI){return ii1il1+lI1llI;},'IliI1I':'https://prodev.m.jd.com/mall/active/2QPgcbnrRzSas2AFvNxFrcXb73zi/index.html?unionActId=31155&d=','lI1Iii':'&cu=true&utm_source=kong&utm_medium=jingfen','i1li':Iil1Il('55','6T4w'),'li1II':function(illIil,Ill1I){return illIil(Ill1I);},'IliI11':function(i11iiI,lIli11){return i11iiI==lIli11;},'i1ll':function(lllI1I,lillI1){return lllI1I>lillI1;},'i1l1lI':function(IlIlii,i1l1i1){return IlIlii||i1l1i1;},'i1iliI':function(liil11,iiillI){return liil11>=iiillI;},'I1iIii':function(l1l111,l1iIII){return l1l111+l1iIII;},'IllII1':Iil1Il('56','Wx@4'),'I1iIil':function(llI1I1,IlIlil,lIli1I){return llI1I1(IlIlil,lIli1I);},'lI1Iil':function(II1il){return II1il();},'lilIiI':function(lllI11,I1lIll){return lllI11==I1lIll;},'i1l1I':function(I1lIli,II1ii){return I1lIli<II1ii;},'IiilIi':function(IIIIII,lillII){return IIIIII*lillII;},'IiilIl':function(ii1ilI,lI1ll1){return ii1ilI<=lI1ll1;},'iii1Ii':function(iIiI1,liil1I){return iIiI1==liil1I;},'iii1Il':Iil1Il('57','2rbv'),'lI1IiI':'\x0a获取新的助力信息','i1lI':function(i11ii1,IlIliI){return i11ii1(IlIliI);},'IlI1l':function(l1iII1,iiill1){return l1iII1*iiill1;}};try{$[Iil1Il('58','6T4w')]=$[Iil1Il('59','g9#k')][$['UserName']]||'';if(!$[Iil1Il('5a','acv)')]){li1IlIl1();}resMsg='';let lIli1i=![];let IIIII1=0x0;let I1lIlI=0x0;let ii1ill=0x0;$['shareFlag']=!![];do{if(iIiII['II1Ii'](I1lIlI,0x2))IIIII1=0x0;$[Iil1Il('5b','Wx@4')]=0x0;newCookie='';$[Iil1Il('5c','Pf98')]='';await Il1il1i();if(!$['url1']){console[Iil1Il('5d','u!kz')](iIiII[Iil1Il('5e','fY$v')]);break;}$[Iil1Il('5f','b0Tm')]='';$[Iil1Il('60','Lqd2')]=I1i111i[Iil1Il('61','xM^i')]('','',$['url1'],$['UVCookie']);$['UVCookieArr'][$[Iil1Il('49','fY$v')]]=iIiII[Iil1Il('62','*Uij')]($['UVCookie'],'');await lil1Il1I();if(!/unionActId=\d+/['test']($[Iil1Il('63','gSLw')])&&!new RegExp(iIiII['i1il']+rebateCode)['test']($['url2'])){console[Iil1Il('64','Lqd2')](iIiII[Iil1Il('65','xM^i')](iIiII[Iil1Il('66','acv)')](iIiII['lI1Il1'],rebateCode),iIiII[Iil1Il('67','GNT%')]));$[Iil1Il('68','iK@U')]=!![];return;}if(!$[Iil1Il('69','UX[0')])$[Iil1Il('6a','sdU8')]=iIiII['IiilII'](iIiII[Iil1Il('6b','b0Tm')]+rebateCode,iIiII['lI1Iii']);$['actId']=$['url2']['match'](/mall\/active\/([^\/]+)\/index\.html/)&&$[Iil1Il('6c','#IlE')][Iil1Il('6d','r#ce')](/mall\/active\/([^\/]+)\/index\.html/)[0x1]||iIiII[Iil1Il('6e','t&ro')];$['UVCookie']=I1i111i['getUVCookie']('','',$[Iil1Il('6f','acv)')],$[Iil1Il('70','d6K5')]);$[Iil1Il('71','AYYq')][$[Iil1Il('72','Pf98')]]=$[Iil1Il('73','UX[0')]+'';$['eid']='';let II1iI=getBody($['UA'],$['url2']);await iIiII['li1II'](lIIlIlll,II1iI);if(!$[Iil1Il('74','UX[0')]){$[Iil1Il('75','t&ro')]=-0x1;}if(iIiII[Iil1Il('76','gSLw')](lI1lll,0x0)){let llI1II=0x0;let lIli1l=!![];let lillIi=0x0;if(iIiII[Iil1Il('77','Nz&X')](Object['getOwnPropertyNames'](liiiII)['length'],IIIII1)&&$['shareFlag']){for(let illIi1 in iIiII[Iil1Il('78','2rbv')](liiiII,{})){if(iIiII[Iil1Il('79','xM^i')](illIi1,$['UserName'])){$[Iil1Il('7a','9m*5')]=0x1;continue;}if(iIiII[Iil1Il('7b','4Ql#')](llI1II,IIIII1)){$[Iil1Il('7c','w^vJ')]=0x0;$[Iil1Il('7d','2rbv')]=liiiII[illIi1]||'';if($[Iil1Il('7e','N@hI')][illIi1]&&$[Iil1Il('7f','1Y&D')][illIi1][Iil1Il('4b','GTdv')]($['UserName'])){lillIi++;continue;}if(iIiII[Iil1Il('80','g9#k')]($['shareCode']['count'],$['shareCodeArr']['shareCount'])){lillIi++;continue;}$['getlj']=![];if($[Iil1Il('81','m6Zk')])console[Iil1Il('82','2rbv')](iIiII[Iil1Il('83','APrP')](iIiII[Iil1Il('84','IOZU')]+illIi1,']'));let ii1ili=await iIiII[Iil1Il('85','acv)')](I111I1I1,$[Iil1Il('86','lu81')][Iil1Il('87','lu81')],0x1);if(/重复助力/[Iil1Il('88','GTdv')](ii1ili)){if(!$[Iil1Il('89','*Uij')][illIi1])$[Iil1Il('8a','u!kz')][illIi1]=[];$[Iil1Il('8b','UX[0')][illIi1][Iil1Il('8c','acv)')]($[Iil1Il('8d','UX[0')]);IIIII1--;ii1ill--;}else if(/助力/[Iil1Il('8e','APrP')](ii1ili)&&/上限/['test'](ii1ili)){$[Iil1Il('8f','OT1F')]=![];}else if(!/领取上限/['test'](ii1ili)&&iIiII[Iil1Il('90','w^vJ')]($[Iil1Il('91','AYYq')],!![])){if(!$[Iil1Il('92','Pf98')][illIi1])$[Iil1Il('93','w^vJ')][illIi1]=[];if(!$[Iil1Il('94','b0Tm')][illIi1][Iil1Il('95','sdU8')]($[Iil1Il('96','NnW4')])){$[Iil1Il('97','iK@U')][illIi1][Iil1Il('98','d6K5')]($[Iil1Il('99','w^vJ')]);}IIIII1--;}else{lIli1l=![];}}llI1II++;}}if(lIli1l&&iIiII[Iil1Il('9a','acv)')](lillIi,Object[Iil1Il('9b','w^vJ')](liiiII)['length'])){lIli1i=!![];}if(llI1II==0x0){$[Iil1Il('9c','Lqd2')]=![];let liil1i=await I111I1I1('',0x1);if(!/领取上限/[Iil1Il('9d','9m*5')](liil1i)&&$[Iil1Il('9e','Pf98')]==!![]){IIIII1--;}}if($['endFlag'])break;}else{let lI1lil=await iIiII[Iil1Il('9f','GNT%')](iIlI11);if(!$['endFlag']&&lI1lil&&$['again']==![])await iIiII[Iil1Il('a0','GTdv')](illi1lIi);if(iIiII[Iil1Il('a1','NnW4')]($[Iil1Il('a2','acv)')],![]))break;}if(iIiII[Iil1Il('a3','Nz&X')]($['again'],!![])&&iIiII[Iil1Il('a4','xM^i')](I1lIlI,0x1)){I1lIlI++;$[Iil1Il('a5','u!kz')]=![];}IIIII1++;ii1ill++;if(iIiII['lilIiI']($['flag'],0x1)){await $[Iil1Il('a6','Hzw9')](parseInt(iIiII[Iil1Il('a7','iK@U')](iIiII[Iil1Il('a8','6T4w')](Math[Iil1Il('a9','OT1F')](),0x258),0x12c),0xa));}if(redTimes>0x0&&iIiII[Iil1Il('aa','APrP')](redTimes,ii1ill))break;}while(iIiII[Iil1Il('ab','Z5eB')]($[Iil1Il('ac','Hzw9')],0x1)&&iIiII[Iil1Il('ad','[[)S')](IIIII1,0x1));if($['endFlag'])return;if(resMsg){message+=iIiII[Iil1Il('ae','gSLw')](iIiII['I1iIii'](iIiII[Iil1Il('af','C2Fg')],$['index']),'】\x0a')+resMsg;}if(lIli1i){console[Iil1Il('b0','cU#S')](iIiII[Iil1Il('b1','b0Tm')]);await iIiII['i1lI'](i1lIIII1,0x1);}await $['wait'](iIiII[Iil1Il('b2','d6K5')](parseInt,iIiII[Iil1Il('b3','GTdv')](Math[Iil1Il('b4','C2Fg')](),0x258)+0x12c,0xa));}catch(i1l1iI){console['log'](i1l1iI);}}async function i1lIIII1(liil1l=0x0){var lI1lii={'i1l11':function(Iiili1,Iil1l1){return Iiili1===Iil1l1;},'i1l1li':function(i1i11I,il1iIl){return i1i11I===il1iIl;},'i1ilii':Iil1Il('b5','^!Tq'),'iIIII1':function(iii1ii,il1iIi){return iii1ii===il1iIi;},'i1l1ll':function(iii1il,II11li){return iii1il<II11li;},'I1iIiI':function(I1l11i,iIIiiI){return I1l11i(iIIiiI);},'li1I1':function(liiI1i,ililIi){return liiI1i>ililIi;},'i1ilil':function(lilIIl,ililIl){return lilIIl==ililIl;},'lilIii':function(liiI1l,i1l1II){return liiI1l+i1l1II;},'i1ill1':function(i1ill){return i1ill();},'iIIl1l':function(I1l11l,lilIIi){return I1l11l(lilIIi);},'llIli1':function(i1l1Il,llIli){return i1l1Il<llIli;},'iliIII':function(i1i11l,i1i11i){return i1i11l===i1i11i;},'iIIl1i':Iil1Il('b6','GTdv'),'I1lllI':function(II11l1,Iil1lI){return II11l1===Iil1lI;}};try{let IiiliI=0x2;if(liil1l==0x1)IiiliI=0x1;let iii1iI=0x0;for(let llIll in $['shareCodeArr']||{}){if(lI1lii[Iil1Il('b7','(uOp')](llIll,Iil1Il('b8','b2kz'))||lI1lii[Iil1Il('b9','2rbv')](llIll,lI1lii[Iil1Il('ba','(uOp')])||lI1lii[Iil1Il('bb',')TDJ')](llIll,Iil1Il('bc','9m*5')))continue;if($[Iil1Il('bd','9m*5')][llIll]&&$[Iil1Il('be','w^vJ')][Iil1Il('bf','*Uij')]&&$[Iil1Il('c0',')TDJ')][llIll][Iil1Il('c1','(M6K')]<$[Iil1Il('c2','t&ro')]['shareCount'])iii1iI++;}for(let il1iII=0x0;lI1lii['i1l1ll'](il1iII,cookiesArr['length'])&&!$[Iil1Il('c3','9m*5')];il1iII++){cookie=cookiesArr[il1iII];if(cookie){$[Iil1Il('c4','sdU8')]=lI1lii[Iil1Il('c5','lu81')](decodeURIComponent,cookie[Iil1Il('c6','N@hI')](/pt_pin=([^; ]+)(?=;?)/)&&cookie['match'](/pt_pin=([^; ]+)(?=;?)/)[0x1]);if(lI1lii[Iil1Il('c7','&(4D')](iIl1lliI[Iil1Il('c8','*Uij')],0x0)&&lI1lii[Iil1Il('c9','4Ql#')](iIl1lliI['indexOf']($[Iil1Il('99','w^vJ')]),-0x1)||$[Iil1Il('ca','NnW4')][$['UserName']])continue;$[Iil1Il('cb','gSLw')]=lI1lii[Iil1Il('cc','g9#k')](il1iII,0x1);await lI1lii[Iil1Il('cd','GTdv')](lI1i1lIi);await lI1lii[Iil1Il('ce','Pf98')](IiIl111I,0x1);let iilli=0x0;for(let llIll in $[Iil1Il('cf','C2Fg')]||{}){if(llIll===Iil1Il('d0','UooZ')||lI1lii[Iil1Il('d1','cU#S')](llIll,Iil1Il('d2','Nz&X'))||llIll==='shareCount')continue;if($['shareCodeArr'][llIll]&&$[Iil1Il('d3','6T4w')][Iil1Il('d4','1Y&D')]&&lI1lii['llIli1']($['shareCodeArr'][llIll][Iil1Il('d5','r#ce')],$['shareCodeArr'][Iil1Il('d6','Z5eB')]))iilli++;}if($[Iil1Il('d7','NnW4')]||iilli-iii1iI>=IiiliI)break;}}}catch(II11lI){console[Iil1Il('45','sdU8')](II11lI);}if(Object[Iil1Il('d8','C2Fg')]($['shareCodeArr'])['length']>0x0){for(let lI1IIi in $['shareCodeArr']||{}){if(lI1lii[Iil1Il('d9','GNT%')](lI1IIi,lI1lii[Iil1Il('da','UooZ')])||lI1lii['I1lllI'](lI1IIi,lI1lii[Iil1Il('db','GTdv')])||lI1lii[Iil1Il('dc','Wx@4')](lI1IIi,Iil1Il('dd','cU#S')))continue;if($[Iil1Il('de','#IlE')][lI1IIi])liiiII[lI1IIi]=$[Iil1Il('df','[du4')][lI1IIi];}}}function I111I1I1(I1l11I='',Ilil1l=0x1){var iIIiii={'lI1Ili':function(iilll,il1iI1){return iilll+il1iI1;},'IliilI':function(IlllIi,iIIiil){return IlllIi==iIIiil;},'i1II1':Iil1Il('e0','GTdv'),'iIIl11':function(i1l1Ii,I1iIIi){return i1l1Ii===I1iIIi;},'l1l1I1':function(I1iIIl,lI1IIl){return I1iIIl>lI1IIl;},'I1iIll':'活动已结束','I1lliI':function(i1ilI,iii1lI){return i1ilI+iii1lI;},'llIllI':Iil1Il('e1','[[)S'),'I1ilI1':Iil1Il('e2','1Y&D'),'iillll':function(i1ilI1,Iiilii){return i1ilI1+Iiilii;},'lIIilI':function(Iil1li,Iiilil){return Iil1li*Iiilil;},'II1li1':'折\x20使用时间:','l1lIlI':function(Iil1ll,iillI){return Iil1ll+iillI;},'IiiIl1':'获得[未知]🎉','lIIil1':Iil1Il('e3','b2kz'),'IIli1':function(lI1III,IIliIi,IllIiI){return lI1III(IIliIi,IllIiI);},'II1liI':function(i1il1,I1l111){return i1il1(I1l111);},'IlI1i1':function(IIii1l,I1iIII){return IIii1l+I1iIII;},'l1lIl1':function(liiI11,ililI1){return liiI11*ililI1;},'IiiIlI':Iil1Il('e4','NnW4'),'Iilli1':'8.3.6','I1l1Il':'getCoupons','llIll1':function(IIii1i,i1ili){return IIii1i+i1ili;},'Illl1l':function(Iiill1,I1iII1){return Iiill1+I1iII1;},'Illl1i':'https://api.m.jd.com/api?functionId=getCoupons&appid=u&_=','lIIiil':Iil1Il('e5','4Ql#'),'l1lIii':function(lilII1,iill1){return lilII1(iill1);},'I11iI1':'&client=apple&clientVersion=8.3.6&h5st=','l1lIil':Iil1Il('e6','b2kz'),'IiiIli':'zh-cn','iillli':'gzip,\x20deflate,\x20br','I1l1Ii':function(iii1l1,IIliIl){return iii1l1+IIliIl;},'I1i11i':Iil1Il('e7','Wx@4')};return new Promise(async II11ll=>{var liiI1I={'Iliil1':function(ililII,lI1II1){return iIIiii['lI1Ili'](ililII,lI1II1);},'i1III':function(i1ilII,iIIii1){return iIIiii[Iil1Il('e8','(M6K')](i1ilII,iIIii1);},'Ii1iIi':function(IllIi1,lilIII){return iIIiii[Iil1Il('e9','m6Zk')](IllIi1,lilIII);},'iliIIl':'不展示弹层','Ii1iIl':function(Ii1ilI,II11i1){return iIIiii[Iil1Il('ea','2rbv')](Ii1ilI,II11i1);},'iliIIi':iIIiii['i1II1'],'ill11I':function(iliIil,iliIii){return iIIiii['iIIl11'](iliIil,iliIii);},'Iliiil':function(lill1i,il1li){return iIIiii['l1l1I1'](lill1i,il1li);},'li1Il':iIIiii[Iil1Il('eb','4Ql#')],'li1Ii':function(iIIill,iilii){return iIIill>iilii;},'Iliiii':Iil1Il('ec','6T4w'),'i1illI':function(Ill11i,iilil){return iIIiii['I1lliI'](Ill11i,iilil);},'i1IIl':function(Ill11l,il1ll){return Ill11l==il1ll;},'I1lll1':function(i1ilIi,lill1l){return i1ilIi==lill1l;},'i1IIi':function(l1l1i1,i1iiI){return l1l1i1+i1iiI;},'IIII1I':function(i1ilIl,llI11I){return i1ilIl+llI11I;},'Iii111':Iil1Il('ed','[du4'),'l1l1II':iIIiii['llIllI'],'Iil1I1':Iil1Il('ee','iK@U'),'Ii1iII':function(Il1i11,iii1li){return iIIiii[Iil1Il('ef',')TDJ')](Il1i11,iii1li);},'l1i11I':function(Iil1i1,IIii11){return iIIiii[Iil1Il('f0','IOZU')](Iil1i1,IIii11);},'II11II':function(iliIl1,Ii1il1){return iIIiii['I1lliI'](iliIl1,Ii1il1);},'Ii1iI1':function(iii1ll,IIliI1){return iIIiii[Iil1Il('f1','APrP')](iii1ll,IIliI1);},'lilIli':Iil1Il('f2','(M6K'),'Iliili':iIIiii[Iil1Il('f3','lu81')],'Iliill':function(il1lI,IliIIl){return iIIiii[Iil1Il('f4','OT1F')](il1lI,IliIIl);},'IIII11':function(I1il1l,lI1l1l){return iIIiii['iillll'](I1il1l,lI1l1l);},'i1illi':Iil1Il('f5','UooZ'),'i1illl':function(IIliII,iiliI){return iIIiii[Iil1Il('f6','9m*5')](IIliII,iiliI);},'I1llil':iIIiii[Iil1Il('f7','AYYq')],'I1llii':function(Ill11I,I1il1i){return iIIiii[Iil1Il('f8','b0Tm')](Ill11I,I1il1i);},'lilIll':function(IliIIi,lI1l1i){return IliIIi+lI1l1i;},'l1i111':iIIiii[Iil1Il('f9','b2kz')],'iliII1':function(i1iil,llI11l){return i1iil==llI11l;},'II11I1':function(I1llIl,i1iii){return I1llIl!==i1iii;},'Iii11I':iIIiii[Iil1Il('fa','r#ce')],'Iil1II':function(I1llIi,IIii1I,llI11i){return iIIiii[Iil1Il('fb','w^vJ')](I1llIi,IIii1I,llI11i);},'iIIl1I':function(i1iIi1,l1l1il){return i1iIi1*l1l1il;},'I1iIli':function(I11i1I,iliIi1){return iIIiii[Iil1Il('fc','cU#S')](I11i1I,iliIi1);}};$['UVCookie']=I1i111i['getUVCookie']('','',$['url2'],$[Iil1Il('fd','OT1F')]);$[Iil1Il('fe','aGPN')][$[Iil1Il('ff','GNT%')]]=iIIiii['IlI1i1']($[Iil1Il('100','Wx@4')],'');let l1l1ii='';let Il1i1I=iIIiii[Iil1Il('101','fY$v')](new Date()[Iil1Il('102','[du4')](),iIIiii['lIIilI'](new Date()[Iil1Il('103','APrP')]()*0x3c,0x3e8))+iIIiii['l1lIl1'](iIIiii[Iil1Il('104','r#ce')](iIIiii[Iil1Il('105','t&ro')](0x8,0x3c),0x3c),0x3e8);let Ii1iii=0x4;if(iIIiii[Iil1Il('106','Hzw9')]($[Iil1Il('107','lu81')]('H',Il1i1I),'21')){Ii1iii=0x2;}const iIIilI={'platform':Ii1iii,'unionActId':iIIiii[Iil1Il('108','(M6K')],'actId':$[Iil1Il('109','UX[0')],'d':rebateCode,'unionShareId':I1l11I,'type':Ilil1l,'eid':$['eid']};const il1l1={'appid':'u','body':iIIilI,'client':Iil1Il('10a','GNT%'),'clientVersion':iIIiii[Iil1Il('10b','Wx@4')],'functionId':iIIiii['I1l1Il']};l1l1ii=await II1IIli1('6a98d',il1l1);l1l1ii=encodeURIComponent(l1l1ii);let Ii1iil='';let Ilil1i={'url':iIIiii[Iil1Il('10c','gSLw')](iIIiii[Iil1Il('10d','fY$v')](iIIiii[Iil1Il('10e','b0Tm')](iIIiii['Illl1l'](iIIiii[Iil1Il('10f','NnW4')],Il1i1I),iIIiii[Iil1Il('110','xM^i')]),iIIiii[Iil1Il('111','u!kz')](encodeURIComponent,$['toStr'](iIIilI))),iIIiii[Iil1Il('112','acv)')])+l1l1ii,'headers':{'accept':iIIiii[Iil1Il('113','IOZU')],'Accept-Language':iIIiii[Iil1Il('114','AYYq')],'Accept-Encoding':iIIiii['iillli'],'Cookie':iIIiii[Iil1Il('115','u!kz')](iIIiii[Iil1Il('116','xM^i')](iIIiii[Iil1Il('117','N@hI')]('',$[Iil1Il('118','iK@U')]),newCookie),'\x20')+cookie,'origin':iIIiii['I1i11i'],'Referer':Iil1Il('119','DVts'),'User-Agent':$['UA']}};if($[Iil1Il('11a','GTdv')])Ilil1i['headers']['Referer']=$[Iil1Il('11b','9m*5')];$[Iil1Il('11c','cU#S')](Ilil1i,async(iili1,II11ii,Iil1iI)=>{try{if(iili1){console[Iil1Il('11d','gSLw')](liiI1I[Iil1Il('11e','w^vJ')]('',$[Iil1Il('11f','(M6K')](iili1)));console[Iil1Il('120','NnW4')](liiI1I[Iil1Il('121','4Ql#')]($[Iil1Il('122','Wx@4')],Iil1Il('123','u!kz')));}else{let II11il=$['toObj'](Iil1iI,Iil1iI);if(liiI1I[Iil1Il('124','u!kz')](typeof II11il,Iil1Il('125','Hzw9'))){if(II11il['msg']){Ii1iil=II11il[Iil1Il('126','aGPN')];console[Iil1Il('127','xM^i')](II11il['msg']);}if(II11il[Iil1Il('128','t&ro')][Iil1Il('129','(M6K')](liiI1I[Iil1Il('12a','Nz&X')])>-0x1&&liiI1I['Ii1iIl'](Ilil1l,0x1))$['again']=!![];if(II11il[Iil1Il('12b','m6Zk')]['indexOf'](liiI1I[Iil1Il('12c','g9#k')])===-0x1&&liiI1I[Iil1Il('12d','w^vJ')](II11il[Iil1Il('12e','4Ql#')][Iil1Il('12f','1Y&D')]('登录'),-0x1)){if(liiI1I[Iil1Il('130','gSLw')](Ilil1l,0x1))$[Iil1Il('131','OT1F')]=0x1;}if(liiI1I[Iil1Il('132','b2kz')](II11il[Iil1Il('133','1Y&D')]['indexOf'](liiI1I[Iil1Il('134','Hzw9')]),-0x1)||liiI1I[Iil1Il('135','*Uij')](II11il[Iil1Il('136','UX[0')][Iil1Il('137','IOZU')](Iil1Il('138','UX[0')),-0x1)){$[Iil1Il('139','UooZ')]=!![];return;}if(I1l11I&&typeof II11il[Iil1Il('13a','*Uij')]!==Iil1Il('13b','u!kz')&&typeof II11il[Iil1Il('13c','GTdv')][Iil1Il('13d','Wx@4')]!==liiI1I['Iliiii']){console[Iil1Il('11d','gSLw')](liiI1I[Iil1Il('13e','Hzw9')](liiI1I['i1III'](liiI1I[Iil1Il('13f','acv)')]('当前',II11il[Iil1Il('140','b0Tm')][Iil1Il('141','gSLw')]),':'),II11il[Iil1Il('142','(M6K')]['joinNum']));}if(II11il[Iil1Il('143','fY$v')]==0x0&&II11il[Iil1Il('144','g9#k')]){if(liiI1I[Iil1Il('145','DVts')](Ilil1l,0x1))$[Iil1Il('146','d6K5')][Iil1Il('147','&(4D')]++;let iIIil1='';if(liiI1I['I1lll1'](II11il[Iil1Il('148','4Ql#')][Iil1Il('149','AYYq')][0x0][Iil1Il('14a','t&ro')],0x1)){$[Iil1Il('14b','Hzw9')]=!![];iIIil1=liiI1I[Iil1Il('14c','b0Tm')](liiI1I[Iil1Il('14d','(M6K')](liiI1I['IIII1I'](liiI1I[Iil1Il('14e','APrP')],II11il[Iil1Il('148','4Ql#')][Iil1Il('14f','sdU8')][0x0][Iil1Il('150','u!kz')])+liiI1I[Iil1Il('151','UooZ')]+$[Iil1Il('152','aGPN')](liiI1I[Iil1Il('153','iK@U')],II11il[Iil1Il('154','IOZU')][Iil1Il('155','lu81')]),'\x20'),$[Iil1Il('156','w^vJ')](liiI1I['Iil1I1'],II11il['data'][Iil1Il('157','APrP')]));}else if(liiI1I[Iil1Il('158','sdU8')](II11il[Iil1Il('159','#IlE')][Iil1Il('15a','cU#S')][0x0][Iil1Il('15b','IOZU')],0x3)){$[Iil1Il('15c','Z5eB')]=!![];iIIil1=liiI1I['IIII1I'](liiI1I[Iil1Il('15d','acv)')](liiI1I['l1i11I'](liiI1I['II11II'](liiI1I[Iil1Il('15e','w^vJ')](liiI1I['Ii1iI1'](liiI1I['Ii1iI1'](liiI1I[Iil1Il('15f','1Y&D')],II11il[Iil1Il('160','N@hI')][Iil1Il('161','gSLw')][0x0][Iil1Il('162','Z5eB')]),'减'),II11il[Iil1Il('163','Wx@4')][Iil1Il('164','w^vJ')][0x0]['discount']),liiI1I[Iil1Il('165','w^vJ')]),$[Iil1Il('166','AYYq')](Iil1Il('167','GTdv'),II11il[Iil1Il('168',')TDJ')]['beginTime'])),'\x20'),$[Iil1Il('169','[[)S')](liiI1I[Iil1Il('16a','d6K5')],II11il[Iil1Il('16b','Pf98')][Iil1Il('16c','NnW4')]));}else if(II11il['data'][Iil1Il('16d','9m*5')][0x0][Iil1Il('16e','C2Fg')]==0x6){$[Iil1Il('16f','[[)S')]=!![];iIIil1=liiI1I[Iil1Il('170','[du4')](liiI1I[Iil1Il('171','UX[0')](liiI1I[Iil1Il('172','cU#S')](liiI1I[Iil1Il('173','UooZ')](liiI1I[Iil1Il('174','Wx@4')](liiI1I[Iil1Il('175','sdU8')],II11il['data'][Iil1Il('176','APrP')][0x0][Iil1Il('177','gSLw')]),'打')+liiI1I[Iil1Il('178','C2Fg')](II11il[Iil1Il('140','b0Tm')][Iil1Il('179','b0Tm')][0x0]['discount'],0xa),liiI1I[Iil1Il('17a','C2Fg')])+$[Iil1Il('17b','OT1F')](liiI1I[Iil1Il('17c','NnW4')],II11il[Iil1Il('17d','^!Tq')][Iil1Il('17e','[[)S')]),'\x20'),$['time'](liiI1I[Iil1Il('17f','sdU8')],II11il[Iil1Il('180','gSLw')][Iil1Il('181','aGPN')]));}else{$['getlj']=!![];iIIil1=liiI1I[Iil1Il('182','UX[0')](liiI1I[Iil1Il('183','(uOp')](liiI1I[Iil1Il('184','IOZU')](liiI1I[Iil1Il('185','&(4D')](liiI1I['l1i111'],II11il[Iil1Il('186','UooZ')]['couponList'][0x0][Iil1Il('187','Pf98')]||'')+'\x20',II11il[Iil1Il('188','d6K5')][Iil1Il('189','(M6K')][0x0][Iil1Il('18a','2rbv')]),liiI1I[Iil1Il('18b','t&ro')])+$[Iil1Il('18c','u!kz')](liiI1I[Iil1Il('18d','Z5eB')],II11il['data'][Iil1Il('18e','AYYq')]),'\x20')+$[Iil1Il('18f','N@hI')](Iil1Il('190','OT1F'),II11il['data']['endTime']);console[Iil1Il('191','aGPN')](Iil1iI);}if(iIIil1){resMsg+=iIIil1+'\x0a';console[Iil1Il('192','UooZ')](iIIil1);}}if(liiI1I[Iil1Il('193','u!kz')](Ilil1l,0x1)&&liiI1I['II11I1'](typeof II11il[Iil1Il('13c','GTdv')],liiI1I[Iil1Il('194','[[)S')])&&typeof II11il['data']['groupData']!=='undefined'&&liiI1I[Iil1Il('195','Pf98')](typeof II11il[Iil1Il('196','acv)')][Iil1Il('197','sdU8')]['groupInfo'],liiI1I[Iil1Il('198','d6K5')])){for(let IlllII of II11il['data'][Iil1Il('199','xM^i')]['groupInfo']||[]){if(IlllII[Iil1Il('19a','Pf98')]==0x2){console[Iil1Il('19b','DVts')](liiI1I[Iil1Il('19c','b2kz')](liiI1I[Iil1Il('19d','iK@U')],IlllII[Iil1Il('19e','[du4')])+Iil1Il('19f','gSLw'));await $[Iil1Il('1a0','Wx@4')](liiI1I['Iil1II'](parseInt,liiI1I[Iil1Il('1a1','DVts')](liiI1I['iIIl1I'](Math[Iil1Il('1a2','lu81')](),0x7d0),0x7d0),0xa));await liiI1I[Iil1Il('1a3','4Ql#')](I111I1I1,'',0x2);}}}}else{console['log'](Iil1iI);}}}catch(I1il1I){$[Iil1Il('1a4','xM^i')](I1il1I,II11ii);}finally{liiI1I[Iil1Il('1a5','Nz&X')](II11ll,Ii1iil);}});});}function iIlI11(II111=''){var lI1l1I={'ilI1ll':function(lill11,liI1i1){return lill11+liI1i1;},'Iillii':function(I11i11,I1llII){return I11i11+I1llII;},'IlI1iI':function(Iil1il,I11i1i){return Iil1il==I11i1i;},'Iillil':function(l1l1iI,I1llI1){return l1l1iI>I1llI1;},'l1lIli':Iil1Il('1a6','UooZ'),'lIIiiI':function(I11i1l,il1il){return I11i1l!==il1il;},'II1lil':function(Il1i1i,iIIili){return Il1i1i<iIIili;},'IIli1l':function(Ii1iiI,Ilil1I){return Ii1iiI<=Ilil1I;},'II1lii':function(iliIiI,II11iI){return iliIiI+II11iI;},'lIIii1':function(Il1i1l,Iil1ii){return Il1i1l+Iil1ii;},'ll1i1':'【账号','IIli1i':'元红包🧧','I1iIi1':function(lill1I,Ii1ii1){return lill1I*Ii1ii1;},'lliil1':function(Ilil11,i1ii1,il1ii){return Ilil11(i1ii1,il1ii);},'IIllI':function(llI111,i1iIiI){return llI111+i1iIiI;},'lliilI':function(IlllI1,I1il11){return IlllI1+I1il11;},'lili1':Iil1Il('1a7','Hzw9'),'ll1l1':Iil1Il('1a8','GTdv'),'IllIIi':Iil1Il('1a9','b2kz'),'IllIIl':'%22}&client=iPhone&clientVersion=&osVersion=iOS&screen=414*896&d_brand=iPhone&d_model=iPhone&lang=zh-cn&sdkVersion=&openudid=','IiiIi1':'*/*','l1ii1':Iil1Il('1aa','6T4w'),'ii1ll':Iil1Il('1ab','OT1F'),'IliI1l':function(lI1l11,II11l){return lI1l11+II11l;},'lliiil':Iil1Il('1ac','r#ce'),'lliiii':'https://prodev.m.jd.com/mall/active/2QPgcbnrRzSas2AFvNxFrcXb73zi/index.html'};let II11i=!![];return new Promise(iI1Iii=>{var liI1ii={'llIlil':function(lIIiIl,iI1Iil){return lI1l1I[Iil1Il('1ad','Hzw9')](lIIiIl,iI1Iil);},'IIlil':function(il1iI,i1iIii){return lI1l1I[Iil1Il('1ae','OT1F')](il1iI,i1iIii);},'ilI1lI':function(i1iIil,liI1il){return lI1l1I[Iil1Il('1af','r#ce')](i1iIil,liI1il);},'IiiIll':Iil1Il('125','Hzw9'),'IIlii':function(llIlIi,llIlIl){return llIlIi>llIlIl;},'IlI1il':function(II11I,il1i1){return II11I===il1i1;},'IilliI':function(lIIiIi,liI1iI){return lI1l1I[Iil1Il('1b0','gSLw')](lIIiIi,liI1iI);},'IlI1ii':lI1l1I[Iil1Il('1b1','6T4w')],'lIIiii':function(iI1Il1,i1iIl1){return lI1l1I['lIIiiI'](iI1Il1,i1iIl1);},'iI1lli':function(i1lli1,llIlII){return lI1l1I[Iil1Il('1b2','N@hI')](i1lli1,llIlII);},'ll1iI':function(IIlII,lIIiII){return lI1l1I['IIli1l'](IIlII,lIIiII);},'iI1lll':function(i1iIlI,li111){return lI1l1I[Iil1Il('1b3','Wx@4')](i1iIlI,li111);},'l1lIll':function(liI1lI,lIIiI1){return lI1l1I['lIIii1'](liI1lI,lIIiI1);},'I1l1II':function(ll1I1,Ii1ili){return lI1l1I['lIIii1'](ll1I1,Ii1ili);},'IIli1I':lI1l1I[Iil1Il('1b4','2rbv')],'I1i11I':'助力满可以领取','llIliI':lI1l1I[Iil1Il('1b5','APrP')],'I1l1I1':function(iI1Ii1,Ii1ill){return lI1l1I[Iil1Il('1b6','*Uij')](iI1Ii1,Ii1ill);},'I1i111':function(llIlI1,iI1IiI){return lI1l1I['I1iIi1'](llIlI1,iI1IiI);},'ilI1li':function(IIlI1,i1iIli,i1iIll){return lI1l1I[Iil1Il('1b7','UX[0')](IIlI1,i1iIli,i1iIll);}};$[Iil1Il('1b8','#IlE')]=I1i111i[Iil1Il('1b9','C2Fg')]('','',$[Iil1Il('1ba','[[)S')],$[Iil1Il('1bb','UooZ')]);$[Iil1Il('1bc',')TDJ')][$['UserName']]=lI1l1I['lIIii1']($[Iil1Il('73','UX[0')],'');let i1lliI={'url':lI1l1I[Iil1Il('1bd',')TDJ')](lI1l1I[Iil1Il('1be','C2Fg')](lI1l1I['IIllI'](lI1l1I[Iil1Il('1bf','cU#S')](lI1l1I[Iil1Il('1c0','2rbv')](lI1l1I['IIllI'](lI1l1I[Iil1Il('1c1','#IlE')](lI1l1I[Iil1Il('1c2','*Uij')](lI1l1I['lliilI'](Iil1Il('1c3','Lqd2')+Date[Iil1Il('1c4','gSLw')](),Iil1Il('1c5','1Y&D'))+$['actId'],lI1l1I[Iil1Il('1c6','AYYq')]),$[Iil1Il('1c7','acv)')]),lI1l1I['ll1l1'])+($[Iil1Il('1c8','sdU8')]?lI1l1I['lliilI'](lI1l1I[Iil1Il('1c9','6T4w')],$['uiUpdateTime'])+',':''),Iil1Il('1ca','NnW4')),rebateCode),'%22,%22eid%22:%22'),$[Iil1Il('1cb','lu81')]),lI1l1I[Iil1Il('1cc','&(4D')]),'headers':{'accept':lI1l1I[Iil1Il('1cd','GNT%')],'Accept-Language':lI1l1I['l1ii1'],'Accept-Encoding':lI1l1I['ii1ll'],'Cookie':lI1l1I[Iil1Il('1ce','APrP')](lI1l1I[Iil1Il('1cf','GNT%')](lI1l1I[Iil1Il('1cf','GNT%')](lI1l1I[Iil1Il('1d0','4Ql#')]('',$[Iil1Il('1d1','IOZU')]),newCookie),'\x20'),cookie),'origin':lI1l1I[Iil1Il('1d2','Wx@4')],'Referer':lI1l1I[Iil1Il('1d3','(M6K')],'User-Agent':$['UA']}};if($['url2'])i1lliI['headers'][Iil1Il('1d4','6T4w')]=$[Iil1Il('1d5','&(4D')];$['get'](i1lliI,async(liI1l1,IllIlI,IiillI)=>{try{if(liI1l1){console[Iil1Il('1d6','UX[0')](liI1ii['llIlil']('',$[Iil1Il('1d7','gSLw')](liI1l1)));console[Iil1Il('45','sdU8')](liI1ii[Iil1Il('1d8','r#ce')]($[Iil1Il('1d9',')TDJ')],Iil1Il('1da','Nz&X')));}else{let ili11I=$[Iil1Il('1db','d6K5')](IiillI,IiillI);if(liI1ii[Iil1Il('1dc','w^vJ')](typeof ili11I,liI1ii[Iil1Il('1dd','b2kz')])){if(ili11I[Iil1Il('1de','(M6K')]){console['log'](ili11I[Iil1Il('1df','N@hI')]);}if(ili11I[Iil1Il('1e0','[du4')][Iil1Il('1e1','cU#S')]('不展示弹层')>-0x1)$[Iil1Il('1e2','^!Tq')]=!![];if(liI1ii['IIlii'](ili11I[Iil1Il('1e3','AYYq')][Iil1Il('1e4','(uOp')](Iil1Il('1e5','xM^i')),-0x1))$[Iil1Il('1e6','gSLw')][$[Iil1Il('1e7','4Ql#')]]=!![];if(liI1ii['IlI1il'](ili11I[Iil1Il('1e8','C2Fg')][Iil1Il('1e9','b2kz')]('上限'),-0x1)&&ili11I['msg'][Iil1Il('1ea',')TDJ')]('登录')===-0x1){$['flag']=0x1;}if(liI1ii[Iil1Il('1eb','9m*5')](ili11I[Iil1Il('1ec','r#ce')][Iil1Il('1ed','sdU8')](Iil1Il('1ee','Nz&X')),-0x1)||liI1ii['IilliI'](ili11I[Iil1Il('1ef','6T4w')][Iil1Il('1f0','#IlE')](Iil1Il('1f1','&(4D')),-0x1)){$[Iil1Il('1f2','N@hI')]=!![];return;}if(ili11I[Iil1Il('1f3','b2kz')]['uiUpdateTime'])$[Iil1Il('1f4','acv)')]=ili11I[Iil1Il('168',')TDJ')][Iil1Il('1f5','2rbv')];if(typeof ili11I[Iil1Il('1f6','6T4w')]!==liI1ii['IlI1ii']&&liI1ii[Iil1Il('1f7','2rbv')](typeof ili11I[Iil1Il('1f8','AYYq')][Iil1Il('1f9','6T4w')],liI1ii['IlI1ii'])&&liI1ii['lIIiii'](typeof ili11I[Iil1Il('140','b0Tm')][Iil1Il('1fa','^!Tq')][Iil1Il('1fb','aGPN')],liI1ii[Iil1Il('1fc',')TDJ')])){$['joinNum']=ili11I[Iil1Il('154','IOZU')][Iil1Il('1fd','C2Fg')][Iil1Il('1fe','6T4w')];$[Iil1Il('d6','Z5eB')]=0x0;for(let li11l of ili11I['data']['groupData'][Iil1Il('1ff','N@hI')]){if(liI1ii['iI1lli']($[Iil1Il('200','2rbv')],li11l[Iil1Il('201','6T4w')]))$[Iil1Il('202','GTdv')]=li11l['num'];}if($[Iil1Il('203','DVts')][$[Iil1Il('204','b2kz')]]){$['shareCodeArr'][$[Iil1Il('205','xM^i')]][Iil1Il('206',')TDJ')]=$[Iil1Il('207','Hzw9')];}$[Iil1Il('208','iK@U')][Iil1Il('bf','*Uij')]=$['shareCount'];if(liI1ii[Iil1Il('209','UooZ')]($[Iil1Il('20a',')TDJ')],$['joinNum'])){if(!$['shareCodeArr'][$[Iil1Il('20b','9m*5')]])$[Iil1Il('20c','(M6K')][$[Iil1Il('49','fY$v')]]={};$[Iil1Il('20d','sdU8')][$[Iil1Il('20e','2rbv')]]['count']=$[Iil1Il('20f','w^vJ')];II11i=![];}console[Iil1Il('64','Lqd2')](liI1ii['iI1lll'](liI1ii[Iil1Il('210','Z5eB')](liI1ii[Iil1Il('211','fY$v')](liI1ii[Iil1Il('212','aGPN')](liI1ii[Iil1Il('213','OT1F')]+$[Iil1Il('214','Hzw9')],'】'),$[Iil1Il('215','UooZ')]||$[Iil1Il('8d','UX[0')])+'\x20',$[Iil1Il('216','N@hI')]),'/')+$[Iil1Il('20a',')TDJ')]+'人');}if(ili11I[Iil1Il('217','lu81')][Iil1Il('218','w^vJ')](Iil1Il('219','UX[0'))>-0x1){II11i=![];}if(typeof ili11I['data']!==liI1ii[Iil1Il('21a','C2Fg')]&&typeof ili11I[Iil1Il('21b','fY$v')]['groupData']!=='undefined'&&liI1ii[Iil1Il('21c','b2kz')](typeof ili11I[Iil1Il('21d','Nz&X')][Iil1Il('21e','OT1F')]['groupInfo'],liI1ii[Iil1Il('21f','Nz&X')])){for(let lliiIl of ili11I[Iil1Il('220','Z5eB')][Iil1Il('221','g9#k')][Iil1Il('222','xM^i')]||[]){if(liI1ii[Iil1Il('223','1Y&D')](lliiIl[Iil1Il('224','[[)S')],0x2)){console['log'](liI1ii[Iil1Il('225','u!kz')](liI1ii[Iil1Il('226','IOZU')]+lliiIl[Iil1Il('227','r#ce')],liI1ii['llIliI']));await $['wait'](parseInt(liI1ii[Iil1Il('228','iK@U')](liI1ii[Iil1Il('229','lu81')](Math[Iil1Il('22a','Hzw9')](),0x7d0),0x7d0),0xa));await liI1ii[Iil1Il('22b','b0Tm')](I111I1I1,'',0x2);}}}}else{console['log'](IiillI);}}}catch(li11i){$['logErr'](li11i,IllIlI);}finally{iI1Iii(II11i);}});});}function illi1lIi(){var lliiIi={'IIli11':'\x20API请求失败，请检查网路重试','IllIII':function(iiIi1I,IllIl1){return iiIi1I==IllIl1;},'ii1li':Iil1Il('22c','sdU8'),'IIll1':function(ll1Ii,ll1Il){return ll1Ii==ll1Il;},'ll1il':function(iiIi11,ill1II){return iiIi11+ill1II;},'IiiIiI':Iil1Il('22d','Lqd2'),'lilii':'***$1','l1iiI':function(i1llil){return i1llil();},'Illl1I':function(i1llii,l1i1I1){return i1llii+l1i1I1;},'lliiiI':function(llIIil,llIIii){return llIIil+llIIii;},'lilil':function(Ii1I1i,llIIlI){return Ii1I1i+llIIlI;},'ll1ll':Iil1Il('22e','GNT%'),'Illl11':Iil1Il('22f','u!kz'),'ii1lI':Iil1Il('230','^!Tq'),'I1ilIl':Iil1Il('231','r#ce'),'I11iII':Iil1Il('232','2rbv'),'I1ilIi':Iil1Il('233','d6K5'),'IiiiI':function(Ii1I1l,IIlIl){return Ii1I1l+IIlIl;},'llIlli':Iil1Il('234','b2kz'),'llIlll':Iil1Il('235','9m*5'),'Iiii1':function(ili11l,Iiilll){return ili11l+Iiilll;},'lIIili':function(Iiilli,IIlIi){return Iiilli+IIlIi;},'IiiIil':function(ili11i,iiIi1l){return ili11i+iiIi1l;},'IiiIii':'】缓存分享码:'};if($['shareCodeArr'][$[Iil1Il('96','NnW4')]]){console[Iil1Il('236','Nz&X')](lliiIi[Iil1Il('237','AYYq')](lliiIi[Iil1Il('238','b2kz')](lliiIi[Iil1Il('239','cU#S')]('【账号',$[Iil1Il('23a','[du4')]),lliiIi[Iil1Il('23b','IOZU')]),$[Iil1Il('23c','Pf98')][$[Iil1Il('23d','lu81')]]['code'][Iil1Il('23e','g9#k')](/.+(.{3})/,Iil1Il('23f','d6K5'))));return;}return new Promise(li11I=>{let lliiII={'url':lliiIi[Iil1Il('240','iK@U')](lliiIi['Illl1I'](lliiIi[Iil1Il('241','(M6K')](lliiIi[Iil1Il('242','NnW4')](lliiIi['ll1ll'],Date[Iil1Il('243','m6Zk')]()),lliiIi[Iil1Il('244','GTdv')])+$[Iil1Il('245','2rbv')]+lliiIi['ii1lI']+rebateCode+Iil1Il('246','NnW4'),$[Iil1Il('247','r#ce')]),lliiIi['I1ilIl']),'headers':{'accept':Iil1Il('248','GTdv'),'Accept-Language':lliiIi[Iil1Il('249','Nz&X')],'Accept-Encoding':lliiIi[Iil1Il('24a','N@hI')],'Cookie':lliiIi['IiiiI'](lliiIi[Iil1Il('24b','b2kz')](''+$[Iil1Il('24c','&(4D')],newCookie)+'\x20',cookie),'origin':lliiIi['llIlli'],'Referer':lliiIi[Iil1Il('24d','APrP')],'User-Agent':$['UA']}};$['get'](lliiII,async(iiIi1i,liI1ll,ll1II)=>{try{if(iiIi1i){console[Iil1Il('236','Nz&X')](''+$['toStr'](iiIi1i));console['log']($[Iil1Il('24e','b2kz')]+lliiIi['IIli11']);}else{let IllIii=$[Iil1Il('24f','GTdv')](ll1II,ll1II);if(lliiIi[Iil1Il('250','Nz&X')](typeof IllIii,lliiIi[Iil1Il('251','b2kz')])){if(lliiIi[Iil1Il('252','Wx@4')](IllIii[Iil1Il('253','UooZ')],0x0)&&IllIii[Iil1Il('254','2rbv')]&&IllIii['data'][Iil1Il('255','^!Tq')]){let liI1li=IllIii[Iil1Il('256','[[)S')][Iil1Il('257','t&ro')][Iil1Il('258','APrP')](/\?s=([^&]+)/)&&IllIii[Iil1Il('1f3','b2kz')]['shareUrl'][Iil1Il('259','Z5eB')](/\?s=([^&]+)/)[0x1]||'';if(liI1li){console[Iil1Il('25a','Wx@4')](lliiIi[Iil1Il('25b','u!kz')](lliiIi[Iil1Il('25c','2rbv')](lliiIi['IiiIiI']+$[Iil1Il('25d','C2Fg')],'】分享码：'),liI1li['replace'](/.+(.{3})/,lliiIi[Iil1Il('25e','&(4D')])));$[Iil1Il('25f','AYYq')][$[Iil1Il('260','Nz&X')]]={'code':liI1li,'count':$[Iil1Il('261','iK@U')]};}}}else{console[Iil1Il('262','t&ro')](ll1II);}}}catch(IllIil){$[Iil1Il('263','sdU8')](IllIil,liI1ll);}finally{lliiIi[Iil1Il('264','OT1F')](li11I);}});});}function lil1Il1I(){var ill1Ii={'liliI':function(llIIl1,ill1Il){return llIIl1(ill1Il);},'ll1lI':function(i1lll1,Ii1I1I){return i1lll1(Ii1I1I);},'IIlli':function(l1i1Ii,l1iI1){return l1i1Ii+l1iI1;}};return new Promise(lliiI1=>{const IiiI1={'url':$[Iil1Il('265','Z5eB')],'followRedirect':![],'headers':{'Cookie':ill1Ii[Iil1Il('266','lu81')](''+$[Iil1Il('1b8','#IlE')]+newCookie,'\x20')+cookie,'User-Agent':$['UA']}};$[Iil1Il('267','AYYq')](IiiI1,async(lilII,IIIiI,iii1i1)=>{try{ill1Ii[Iil1Il('268','b0Tm')](ll1ilil,IIIiI);$[Iil1Il('269','b2kz')]=IIIiI&&IIIiI[Iil1Il('26a','t&ro')]&&(IIIiI[Iil1Il('26b','6T4w')][Iil1Il('26c','d6K5')]||IIIiI[Iil1Il('26d','u!kz')][Iil1Il('26e','[[)S')]||'')||'';$[Iil1Il('26f','*Uij')]=ill1Ii[Iil1Il('270','lu81')](decodeURIComponent,$[Iil1Il('26f','*Uij')]);$[Iil1Il('271','Z5eB')]=$['url2'][Iil1Il('272','GNT%')](/(https:\/\/prodev[\.m]{0,}\.jd\.com\/mall[^'"]+)/)&&$['url2'][Iil1Il('273','gSLw')](/(https:\/\/prodev[\.m]{0,}\.jd\.com\/mall[^'"]+)/)[0x1]||'';}catch(IllIll){$[Iil1Il('274','AYYq')](IllIll,IIIiI);}finally{ill1Ii[Iil1Il('275','DVts')](lliiI1,iii1i1);}});});}function Il1il1i(){var i1lllI={'I1ilII':function(llIIi1,iI1IlI){return llIIi1(iI1IlI);},'I11iIl':function(l1i1Il,ill1I1){return l1i1Il+ill1I1;},'l1l11l':Iil1Il('276','xM^i'),'IilIil':function(l1i1II,ili111){return l1i1II+ili111;}};return new Promise(Ii1I11=>{var IllIli={'lIIill':function(ii1Ii,ii1Il){return i1lllI[Iil1Il('277','1Y&D')](ii1Ii,ii1Il);}};const l1iII={'url':i1lllI[Iil1Il('278','UooZ')](i1lllI[Iil1Il('279','sdU8')](i1lllI['l1l11l'],rebateCode),$[Iil1Il('27a',')TDJ')]&&i1lllI[Iil1Il('27b',')TDJ')](Iil1Il('27c','Pf98'),$[Iil1Il('27d','C2Fg')])||''),'followRedirect':![],'headers':{'Cookie':i1lllI[Iil1Il('27e','u!kz')](i1lllI[Iil1Il('27f','GNT%')]('',$['UVCookie'])+newCookie+'\x20',cookie),'User-Agent':$['UA']}};$[Iil1Il('280','UX[0')](l1iII,async(iI1Ill,lilI1,IIIi1)=>{try{IllIli[Iil1Il('281','Lqd2')](ll1ilil,lilI1);$['url1']=IIIi1&&IIIi1['match'](/(https:\/\/u\.jd\.com\/jda[^']+)/)&&IIIi1[Iil1Il('282','OT1F')](/(https:\/\/u\.jd\.com\/jda[^']+)/)[0x1]||'';}catch(i1llli){$[Iil1Il('283','Pf98')](i1llli,lilI1);}finally{IllIli[Iil1Il('284','N@hI')](Ii1I11,IIIi1);}});});}function lIIlIlll(i1llll){var iI1Ili={'l1iIIl':function(llIIiI,iI1111){return llIIiI>iI1111;},'iiilll':Iil1Il('285','IOZU'),'lI11Il':'京东api返回数据为空，请检查自身原因','lIII1i':function(IIIl1,ii1ii){return IIIl1+ii1ii;},'l11i11':'https://gia.jd.com/fcf.html?a=','IilIl1':Iil1Il('286','AYYq')};return new Promise(Iii1=>{var I1I1lI={'l1iIl':function(ii1il,l1iIlI){return iI1Ili[Iil1Il('287','[du4')](ii1il,l1iIlI);},'illIll':iI1Ili[Iil1Il('288','r#ce')],'iIli1I':iI1Ili[Iil1Il('289','b2kz')],'Iiil1':function(iI111I,IIIlI1){return iI111I(IIIlI1);}};const i1lIiI={'url':iI1Ili[Iil1Il('28a','g9#k')](iI1Ili['l11i11'],i1llll['a']),'body':iI1Ili[Iil1Il('28b','w^vJ')]('d=',i1llll['d']),'headers':{'Content-Type':iI1Ili['IilIl1'],'User-Agent':$['UA']}};$[Iil1Il('28c','Nz&X')](i1lIiI,async(IiiIl,ii1l1l,l1lli1)=>{try{if(IiiIl){throw new Error(IiiIl);}else{if(I1I1lI[Iil1Il('28d','sdU8')](l1lli1[Iil1Il('28e','[[)S')](I1I1lI[Iil1Il('28f','t&ro')]),0x0)){l1lli1=l1lli1[Iil1Il('290','[[)S')](I1I1lI[Iil1Il('291','r#ce')],0x2);l1lli1=JSON[Iil1Il('292','2rbv')](l1lli1[0x1]);$[Iil1Il('293','Lqd2')]=l1lli1['eid'];}else{console[Iil1Il('294','#IlE')](I1I1lI[Iil1Il('295','DVts')]);}}}catch(IiiIi){$[Iil1Il('296',')TDJ')](IiiIi,ii1l1l);}finally{I1I1lI['Iiil1'](Iii1,l1lli1);}});});}function ll1ilil(ii1l1i){var l1iIl1={'lilIi':Iil1Il('297','d6K5'),'l1l11I':function(ii1iI,IIIil){return ii1iI==IIIil;},'lilIl':function(IIIii,iI111i){return IIIii+iI111i;}};let I1I1l1=ii1l1i&&ii1l1i[Iil1Il('298','Hzw9')]&&(ii1l1i['headers'][Iil1Il('299','[[)S')]||ii1l1i[Iil1Il('29a','*Uij')][l1iIl1[Iil1Il('29b','u!kz')]]||'')||'';let iI111l='';if(I1I1l1){if(typeof I1I1l1!=Iil1Il('29c','r#ce')){iI111l=I1I1l1[Iil1Il('29d',')TDJ')](',');}else iI111l=I1I1l1;for(let i1lIii of iI111l){let III11i=i1lIii[Iil1Il('29e','C2Fg')](';')[0x0]['trim']();if(III11i[Iil1Il('29f','b0Tm')]('=')[0x1]){if(III11i[Iil1Il('2a0','&(4D')]('=')[0x0]==Iil1Il('2a1','GNT%')&&III11i['split']('=')[0x1]){$[Iil1Il('2a2','DVts')]=III11i[Iil1Il('2a3','4Ql#')]('=')[0x1];}if(l1iIl1[Iil1Il('2a4','cU#S')](newCookie[Iil1Il('2a5','GTdv')](III11i[Iil1Il('2a6','UX[0')]('=')[0x1]),-0x1))newCookie+=l1iIl1[Iil1Il('2a7','g9#k')](III11i[Iil1Il('2a8','^!Tq')](/ /g,''),';\x20');}}}}function lI1i1lIi(i1lIil=0x1){var III11l={'iIli11':function(llIl1i,llIl1l){return llIl1i==llIl1l;},'Iiiil':Iil1Il('2a9','Wx@4'),'Iiiii':function(IiiII,Iiil){return IiiII+Iiil;},'l11i1I':Iil1Il('2aa','iK@U'),'IiII':function(IIIli,ii1i1){return IIIli+ii1i1;},'llIIli':Iil1Il('2ab','DVts'),'lIII1I':Iil1Il('2ac','iK@U')};i1lIil=0x1;if(III11l['iIli11'](i1lIil,0x2)){$['UA']=III11l[Iil1Il('2ad','acv)')];}else{let Iiii=$[Iil1Il('2ae','fY$v')][Iil1Il('2af','1Y&D')](III11l[Iil1Il('2b0','Z5eB')]($[Iil1Il('2b1','u!kz')],III11l[Iil1Il('2b2','*Uij')]))[Iil1Il('2b3','t&ro')]();$['UA']=III11l['IiII'](III11l['IiII'](III11l['llIIli'],Iiii),III11l[Iil1Il('2b4','AYYq')]);}}function ii1IIllI(llIl11){var IIIll={'liIiI':function(I1I1il,l1llii){return I1I1il==l1llii;},'l1il1I':Iil1Il('2b5','9m*5')};if(IIIll[Iil1Il('2b6','(uOp')](typeof llIl11,IIIll[Iil1Il('2b7','acv)')])){try{return JSON['parse'](llIl11);}catch(liII1){console['log'](liII1);$[Iil1Il('1ec','r#ce')]($[Iil1Il('2b8','Lqd2')],'','请勿随意在BoxJs输入框修改内容\x0a建议通过脚本去获取cookie');return[];}}}async function iI1iill1(I1I1ii){return new Promise(l1llil=>setTimeout(l1llil,I1I1ii));}async function ii1iIi1i(){var IIIlIi={'li1':function(llIl1I,i1lIl1){return llIl1I+i1lIl1;},'illIl1':Iil1Il('2b9','GNT%'),'l1llII':Iil1Il('2ba','sdU8'),'IilIll':Iil1Il('2bb','(uOp'),'lI11Ii':Iil1Il('2bc','Pf98'),'Iiill':Iil1Il('2bd','fY$v'),'l11i1i':function(liIli1,IIIlIl){return liIli1(IIIlIl);}};try{const {JSDOM}=jsdom;let IIIlI={'url':IIIlIi[Iil1Il('2be','b2kz')](IIIlIi[Iil1Il('2bf','(uOp')](Iil1Il('2c0','1Y&D'),rebateCode),Iil1Il('2c1','u!kz')),'referrer':IIIlIi['illIl1'],'userAgent':IIIlIi[Iil1Il('2c2','OT1F')],'runScripts':IIIlIi[Iil1Il('2c3','IOZU')],'resources':new jsdom[IIIlIi['lI11Ii']]({'userAgent':IIIlIi[Iil1Il('2c4','Z5eB')],'referrer':IIIlIi[Iil1Il('2c5','gSLw')]}),'includeNodeLocations':!![],'storageQuota':0x989680,'pretendToBeVisual':!![],'virtualConsole':new jsdom[IIIlIi[(Iil1Il('2c6','GTdv'))]]()};const IiiI=new JSDOM(Iil1Il('2c7','d6K5'),IIIlI);await IIIlIi[Iil1Il('2c8','6T4w')](iI1iill1,0x3e8);l1iIi11I=IiiI[Iil1Il('2c9','Hzw9')];}catch(iIi1i){console[Iil1Il('2ca','4Ql#')](iIi1i);}}async function II1IIli1(l1iIll,l1iIli){var iIi1l={'l1il11':function(i1lIlI,l1lliI){return i1lIlI(l1lliI);},'IiI1':function(I1I1iI,IIIlII){return I1I1iI(IIIlII);},'illIli':function(iiIiI1,ili1Il){return iiIiI1===ili1Il;},'l11i1l':Iil1Il('2cb','Wx@4'),'lIII11':function(ili1Ii,Iilll1){return ili1Ii+Iilll1;},'IiilI':Iil1Il('2cc','AYYq'),'ii1I11':function(ll11I,iIi1I){return ll11I+iIi1I;},'liIi1':Iil1Il('2cd','DVts'),'lI11II':function(liIIl,IlI1lI){return liIIl+IlI1lI;},'l1llI1':Iil1Il('2ce','APrP'),'IillIi':function(liIIi){return liIIi();},'lii':function(IilllI,iI1lIi){return IilllI+iI1lIi;},'IllI1i':function(l1lllI,llliIi){return l1lllI+llliIi;}};if(!$[Iil1Il('2cf','(M6K')][$[Iil1Il('2d0','gSLw')]])$['getH5st_WQ_Arr'][$['UserName']]={};let i1lIli=$[Iil1Il('2d1','Wx@4')][$[Iil1Il('2d2','Wx@4')]];if(!l1iIi11I){await iIi1l[Iil1Il('2d3','xM^i')](ii1iIi1i);}l1iIi11I['localStorage'][Iil1Il('2d4','aGPN')](iIi1l[Iil1Il('2d5','NnW4')](iIi1l['IiilI'],l1iIll),i1lIli[iIi1l[Iil1Il('2d6','*Uij')](iIi1l[Iil1Il('2d7','w^vJ')],l1iIll)]||'');l1iIi11I[Iil1Il('2d8','#IlE')][Iil1Il('2d9','(M6K')](Iil1Il('2da','(uOp')+l1iIll,i1lIli[iIi1l['IllI1i'](Iil1Il('2db','r#ce'),l1iIll)]||'');l1iIi11I['localStorage'][Iil1Il('2dc','*Uij')](iIi1l[Iil1Il('2dd','acv)')]('WQ_qe_',l1iIll),i1lIli[iIi1l[Iil1Il('2de','Z5eB')](iIi1l[Iil1Il('2df','APrP')],l1iIll)]||'');return new Promise(async i1lIll=>{let ll11ii='';try{if(iIi1l[Iil1Il('2e0','1Y&D')](typeof l1iIi11I['signWaap'],iIi1l[Iil1Il('2e1','*Uij')])){ll11ii=await l1iIi11I[Iil1Il('2e2','9m*5')](l1iIll,l1iIli);}else{let liIlii=0x0;timer=setInterval(async()=>{liIlii++;if(typeof l1iIi11I[Iil1Il('2e3','m6Zk')]===Iil1Il('2e4','g9#k')){iIi1l['l1il11'](clearInterval,timer);timer=null;ll11ii=await l1iIi11I['signWaap'](l1iIll,l1iIli);}if(liIlii>=0x64){iIi1l[Iil1Il('2e5','Hzw9')](clearInterval,timer);}},0x64);}}catch(llii1l){console[Iil1Il('2e6','AYYq')](llii1l);}finally{if(ll11ii){i1lIli[iIi1l[Iil1Il('2e7','AYYq')](Iil1Il('2e8','sdU8'),l1iIll)]=l1iIi11I['localStorage']['getItem'](iIi1l['lIII11'](iIi1l[Iil1Il('2e9','Z5eB')],l1iIll));i1lIli[iIi1l['ii1I11'](iIi1l[Iil1Il('2ea','AYYq')],l1iIll)]=l1iIi11I[Iil1Il('2eb','sdU8')][Iil1Il('2ec','lu81')](iIi1l[Iil1Il('2ed',')TDJ')](Iil1Il('2ee','m6Zk'),l1iIll));i1lIli[iIi1l[Iil1Il('2ef','APrP')](iIi1l[Iil1Il('2f0','^!Tq')],l1iIll)]=l1iIi11I[Iil1Il('2f1','[du4')][Iil1Il('2f2','r#ce')](iIi1l['l1llI1']+l1iIll);}iIi1l[Iil1Il('2f3','r#ce')](i1lIll,ll11ii);}});}function li1IlIl1(){var liIlil={'i11I1i':Iil1Il('2f4','fY$v'),'IillIl':Iil1Il('2f5','[[)S'),'llliil':Iil1Il('2f6','w^vJ'),'liIl1':Iil1Il('2f7','aGPN'),'II1lli':function(llii1i,ll11il){return llii1i+ll11il;},'ii1I1I':function(iI1lIl,iiIiII){return iI1lIl*iiIiII;},'IiIl':function(Iili,iIi11){return Iili>=iIi11;},'IiIi':function(Iil1,ll11lI){return Iil1(ll11lI);},'iI1ll1':function(llliI1,liIII){return llliI1>liIII;},'IlI1Il':function(llii11,Iillli){return llii11/Iillli;},'l1il1l':function(ll11l1,ll111){return ll11l1-ll111;},'liIil':Iil1Il('2f8','APrP'),'IllI1I':Iil1Il('2f9','m6Zk'),'liIii':'__jdv','II1ll1':'__jdc','ll1':function(llliII,iiIiIl){return llliII-iiIiIl;},'iI1llI':function(IlI1l1,liIliI){return IlI1l1>liIliI;},'llliii':function(llii1I,iiIiIi){return llii1I<iiIiIi;},'IllI11':function(l1lll1,IilI){return l1lll1<IilI;},'l1llIi':function(liIlli,lil11){return liIlli>lil11;},'II1llI':function(Iillll,lllI1,III11I){return Iillll(lllI1,III11I);},'i11I11':function(Ilii1,ll11i1){return Ilii1!==ll11i1;},'l1llIl':Iil1Il('2fa','Wx@4'),'ii1I1l':'utm_medium','ii1I1i':'utm_term','llI':function(ili1I1,Iill){return ili1I1||Iill;},'llliI':function(ili1II,liIllI){return ili1II<liIllI;},'iI1li1':function(ll11i,iI1lI1){return ll11i(iI1lI1);},'lllii1':Iil1Il('2fb','xM^i'),'liIli':Iil1Il('2fc','g9#k'),'liIll':Iil1Il('2fd','N@hI'),'IilIi1':Iil1Il('2fe','cU#S'),'iI1liI':function(I1I1li,l1i11){return I1I1li!==l1i11;},'l1lIiI':function(IlI1li,IlI1ll){return IlI1li!==IlI1ll;},'llliiI':function(ll11l,III111,liIll1){return ll11l(III111,liIll1);},'IilIiI':function(l1llli,iI1lII){return l1llli/ iI1lII;},'i1i1I1':function(ll11iI,l1i1I){return ll11iI*l1i1I;},'IlII1':function(l1llll,I1I1ll){return l1llll===I1I1ll;},'IiI11':function(lil1i,liiiil){return lil1i||liiiil;},'lli':function(IIIIli,lllIi){return IIIIli+lllIi;},'liIlI':function(lil1l,lllIl){return lil1l+lllIl;},'lll':function(Iliii,illlii){return Iliii||illlii;},'llli1':function(I1lIIi,l1i1i){return I1lIIi||l1i1i;},'iIli1i':Iil1Il('2ff','b0Tm'),'iI1lii':function(I1iI1i,l1i1l){return I1iI1i-l1i1l;},'IilIii':'mba_sid','l1lIi1':Iil1Il('300','^!Tq'),'iIli1l':'/log/m','i1i1II':'000001','liiIIl':'__trb','iil1iI':Iil1Il('301','UX[0'),'IlIllI':Iil1Il('302','acv)'),'il1i1I':Iil1Il('303','2rbv'),'lI1li1':'__jdwxapp','iI11II':'__jd_ref_cls','iIII1I':Iil1Il('304','Nz&X'),'ilil1i':Iil1Il('305','APrP'),'IlIIi':'wap.sogo.com:keyword','IiI1l':'page.roboo.com:q','illlII':Iil1Il('306','[du4'),'iIII11':Iil1Il('307','fY$v'),'IiI1i':Iil1Il('308','N@hI'),'llll1':'roboo:word','lil11l':'roboo:q','i1i1Il':Iil1Il('309','b0Tm'),'I1lIl1':Iil1Il('30a','[du4'),'lil11i':Iil1Il('30b','OT1F'),'IlIIl':Iil1Il('30c','xM^i'),'lI1liI':'sogo.com:keyword','i1i1Ii':Iil1Il('30d','t&ro'),'lllii':Iil1Il('30e','m6Zk'),'iI11Ii':Iil1Il('30f','GNT%'),'lllil':function(I1iI1l,illlil){return I1iI1l+illlil;},'iI11Il':Iil1Il('310','GNT%'),'iil1i1':function(Iliil,I1lIIl){return Iliil>I1lIIl;},'il1i11':Iil1Il('311','&(4D'),'IlIII':function(l1ilI1,l1l1Il){return l1ilI1+l1l1Il;},'ilil1l':'(^|\x20)','IiI1I':function(lil1I,l1l1Ii){return lil1I+l1l1Ii;},'illlIl':'(?:^|&|[?]|[/])','IIIIIl':function(IIIIlI,l1i11l){return IIIIlI-l1i11l;},'I1lIil':function(liiil1,lllII){return liiil1&lllII;},'IIIl1i':function(l11iII,l1i11i){return l11iII+l1i11i;},'liiII1':function(l11iI1,IliiI){return l11iI1&IliiI;},'IIIl1l':function(lI111i,I1lIII){return lI111i<<I1lIII;},'lllll':function(liIlll,I1iI1I){return liIlll<<I1iI1I;},'i11ili':function(illll1,IIIIl1){return illll1^IIIIl1;},'iil1l1':function(liiilI,lI111l){return liiilI>>lI111l;},'iiili1':function(liiii1,IIiiIl){return liiii1>=IIiiIl;},'ill11l':Iil1Il('312','g9#k'),'lllili':function(l1ilIl){return l1ilIl();},'IliiiI':'JDMAGetMPageParam','liiIII':function(IIiiIi,l1ilIi){return IIiiIi/l1ilIi;},'li1i11':function(l11iIi,ll11li){return l11iIi+ll11li;},'iI11I1':function(iliIlI,lI111I){return iliIlI==lI111I;},'il1i1l':function(IlilI,llIi1){return IlilI+llIi1;},'IIIl1I':Iil1Il('313','Pf98'),'iil1ii':Iil1Il('314','Nz&X'),'IlIlli':Iil1Il('315','d6K5'),'il1i1i':'getParameter','lil111':Iil1Il('316','acv)'),'i11ilI':Iil1Il('317','IOZU'),'ii1ii1':Iil1Il('318','Nz&X'),'llllI':'isEmbedded','lllil1':Iil1Il('319','acv)'),'iil1il':'getPageParamFromSdk'};class IliIII{constructor(){var II1l=Iil1Il('31a','b0Tm')[Iil1Il('290','[[)S')]('|'),liiiiI=0x0;while(!![]){switch(II1l[liiiiI++]){case'0':this['mr']=[0x1,0x0];continue;case'1':this[Iil1Il('60','Lqd2')]='';continue;case'2':this[Iil1Il('31b','1Y&D')]={};continue;case'3':this[Iil1Il('31c','r#ce')]={'userAgent':liIlil[Iil1Il('31d','m6Zk')],'userAgents':liIlil[Iil1Il('31e','Z5eB')]};continue;case'4':this[Iil1Il('31f','9m*5')]={'cookie':'','cookies':liIlil['IillIl'],'domain':Iil1Il('320','(M6K'),'referrer':liIlil['llliil'],'location':{'href':Iil1Il('321','#IlE'),'hrefs':liIlil['liIl1']}};continue;case'5':this[Iil1Il('322','#IlE')]=0x0;continue;}break;}}[liIlil[Iil1Il('323','cU#S')]](II1i='',illli1='',I1lII1='',Ill111=''){try{this[Iil1Il('324','UX[0')][Iil1Il('325','fY$v')]['href']=this[Iil1Il('326','1Y&D')][Iil1Il('327','Pf98')][Iil1Il('328','m6Zk')]+'';this['document']['cookie']=liIlil['II1lli'](this[Iil1Il('329','b0Tm')]['cookies'],'');if(I1lII1)this[Iil1Il('32a','xM^i')][Iil1Il('32b','&(4D')][Iil1Il('32c','APrP')]=I1lII1;if(Ill111)this[Iil1Il('32d','t&ro')][Iil1Il('32e','t&ro')]=Ill111;this['UVCookie']='';this[Iil1Il('32f','1Y&D')][Iil1Il('330','1Y&D')]=liIlil[Iil1Il('331','APrP')](this[Iil1Il('332','#IlE')][Iil1Il('333','(uOp')],'');this[Iil1Il('334','&(4D')]=0x3f3+Math['round'](liIlil[Iil1Il('335','acv)')](0x1f,Math[Iil1Il('336',')TDJ')]()));if(![]){this['mr'][0x1]++;if(liIlil[Iil1Il('337','Pf98')](this['mr'][0x1],0x13a)){this['mr'][0x1]=Math['round'](0x1f*Math['random']());}if(!illli1){illli1=$[Iil1Il('338','UX[0')][Iil1Il('339','fY$v')]('')['toString']();}let I1iI11=0x0;while(!![]){this['mr'][0x0]=liIlil[Iil1Il('33a','cU#S')](parseInt,illli1[Iil1Il('33b',')TDJ')](/\d/g)[I1iI11]);I1iI11++;if(liIlil[Iil1Il('33c','b0Tm')](this['mr'][0x0],0x0)||liIlil[Iil1Il('33d','d6K5')](I1iI11,illli1['match'](/\d/g)['length'])){break;}}this['mr'][0x0]+=Math['round'](liIlil[Iil1Il('33e','Pf98')](liIlil[Iil1Il('33f','^!Tq')](new Date()[Iil1Il('340','Z5eB')](),new Date(Iil1Il('341','u!kz'))[Iil1Il('342','b0Tm')]()),0x5265c00));}if(II1i)this[Iil1Il('343','b0Tm')][Iil1Il('344','#IlE')]=II1i;this['lr']={'ckJda':liIlil['liIil'],'ckJdb':liIlil['IllI1I'],'ckJdv':liIlil[Iil1Il('345','d6K5')],'ckJdc':liIlil[Iil1Il('346','cU#S')],'refUrl':liIlil[Iil1Il('347','NnW4')]};this['q']();this['s'](illli1);return this['UVCookie'];}catch(II11){console[Iil1Il('348','APrP')](II11);}}['s'](l1ilII=''){var ii1II1,iliIll,llliIl,iliIli,illliI=(this[Iil1Il('349','UX[0')](this['lr'][Iil1Il('34a','^!Tq')])||'')['split']('.'),ii1III=(this[Iil1Il('34b','b0Tm')](this['lr']['ckJdb'])||'')[Iil1Il('34c','Lqd2')]('.'),i11iIl=(this[Iil1Il('34d','gSLw')](this['lr']['ckJdv'])||'')[Iil1Il('34e','(M6K')]('|'),ll11ll=this['getCookie'](this['lr'][Iil1Il('34f','9m*5')])||'',l11iIl=parseInt(liIlil[Iil1Il('350','w^vJ')](liIlil['ll1'](new Date()[Iil1Il('102','[du4')](),this[Iil1Il('351','d6K5')]),0x3e8)),i11iIi=0x0,IIIIll=0x1,liiiii=Iil1Il('352','(uOp'),II1I='-',lI1111='none',Ilil1='-';if(liIlil[Iil1Il('353','AYYq')](illliI[Iil1Il('354','lu81')],0x3))for(var IliII1=0x2;liIlil[Iil1Il('355','IOZU')](IliII1,0x5)&&liIlil[Iil1Il('356','w^vJ')](IliII1,illliI[Iil1Il('357','u!kz')]);IliII1++){var l1iIi1=illliI[IliII1];liIlil[Iil1Il('358','xM^i')](l1iIi1[Iil1Il('359','[du4')],0xa)&&(illliI[IliII1]=l1iIi1['substr'](0x0,0xa));}liIlil[Iil1Il('35a','#IlE')](illliI[Iil1Il('35b','N@hI')],0x5)?(llliIl=illliI[0x0],iliIli=illliI[0x1],ii1II1=parseInt(illliI[0x2],0xa),iliIll=liIlil[Iil1Il('35c','t&ro')](parseInt,illliI[0x3],0xa),l11iIl=liIlil[Iil1Il('35d','iK@U')](parseInt,illliI[0x4],0xa),IIIIll=liIlil['II1llI'](parseInt,illliI[0x5],0xa)||IIIIll):(iliIli=this[Iil1Il('35e','(M6K')](),ii1II1=l11iIl,iliIll=l11iIl),this['lr']['uuid']=iliIli,ii1III[Iil1Il('35f','(uOp')]>0x3&&(llliIl||(llliIl=ii1III[0x0]),i11iIi=parseInt(ii1III[0x1],0xa)||0x0),i11iIl['length']>0x4&&(llliIl||(llliIl=i11iIl[0x0]),liiiii=i11iIl[0x1],II1I=i11iIl[0x2],lI1111=i11iIl[0x3],Ilil1=i11iIl[0x4]),ll11ll&&liIlil[Iil1Il('360','4Ql#')]('',ll11ll)&&(llliIl||(llliIl=ll11ll));var i1I1I,llIil=[],llIii=ii1III[Iil1Il('361','Hzw9')]<0x4,IIiiI1=this['getParameter'](liIlil[Iil1Il('362','GNT%')]),IIIIi1=!0x1;if(IIiiI1){var ii1IIl=this['getParameter']('utm_campaign'),ii1IIi=this[Iil1Il('363','OT1F')](liIlil[Iil1Il('364','6T4w')]),I1ll1l=this[Iil1Il('363','OT1F')](liIlil[Iil1Il('365','[du4')]);llIil[Iil1Il('366','sdU8')](IIiiI1||liiiii),llIil['push'](ii1IIl||II1I),llIil[Iil1Il('367','w^vJ')](liIlil[Iil1Il('368','d6K5')](ii1IIi,lI1111)),llIil[Iil1Il('369','[[)S')](I1ll1l||Ilil1),Ilil1=llIil[0x3],IIIIi1=!0x0;}else{var I1ll1i,i11iII=this['lr'][Iil1Il('36a','9m*5')]&&this['lr'][Iil1Il('36b','AYYq')][Iil1Il('36c','N@hI')]('/')[0x2],lI1Ii1=!0x1;if(i11iII&&i11iII[Iil1Il('36d','N@hI')](this['lr'][Iil1Il('36e','b0Tm')])<0x0){for(I1ll1i=this['lr']['seo'],IliII1=0x0;liIlil[Iil1Il('36f','Z5eB')](IliII1,I1ll1i[Iil1Il('361','Hzw9')]);IliII1++){var i1I11=I1ll1i[IliII1][Iil1Il('370','acv)')](':');if(i11iII[Iil1Il('371','NnW4')](i1I11[0x0][Iil1Il('372','UX[0')]())>-0x1&&liIlil[Iil1Il('373','Wx@4')](this['lr'][Iil1Il('374','fY$v')][Iil1Il('375','4Ql#')]((i1I11[0x1]+'=')[Iil1Il('376','1Y&D')]()),-0x1)){var I1I1i1=this[Iil1Il('377','GTdv')](i1I11[0x1],this['lr']['refUrl']);/[^\x00-\xff]/[Iil1Il('378','UX[0')](I1I1i1)&&(I1I1i1=liIlil[Iil1Il('379','NnW4')](encodeURIComponent,I1I1i1)),llIil[Iil1Il('37a','&(4D')](i1I11[0x0]),llIil[Iil1Il('37b','aGPN')]('-'),llIil['push'](Iil1Il('37c','^!Tq')),llIil[Iil1Il('37d','*Uij')](I1I1i1||liIlil['lllii1']),Ilil1=llIil[0x3],lI1Ii1=!0x0;break;}}lI1Ii1||(i11iII['indexOf'](liIlil[Iil1Il('37e','fY$v')])>-0x1?(llIil[Iil1Il('98','d6K5')](liIlil['liIli']),llIil[Iil1Il('37f','UooZ')]('-'),llIil[Iil1Il('380','xM^i')](liIlil[Iil1Il('381','t&ro')]),llIil[Iil1Il('382',')TDJ')](liIlil[Iil1Il('383','g9#k')])):(llIil[Iil1Il('98','d6K5')](i11iII),llIil['push']('-'),llIil['push'](liIlil['IilIi1']),llIil[Iil1Il('384','Pf98')]('-')));}}i1I1I=liIlil[Iil1Il('385','6T4w')](llIil['length'],0x0)&&(liIlil['iI1liI'](llIil[0x0],liiiii)||liIlil[Iil1Il('386','b0Tm')](llIil[0x1],II1I)||liIlil['l1lIiI'](llIil[0x2],lI1111))&&liIlil[Iil1Il('387','Z5eB')](liIlil[Iil1Il('388','aGPN')],llIil[0x2]),llIii||!llIii&&i1I1I?(liiiii=llIil[0x0]||liiiii,II1I=llIil[0x1]||II1I,lI1111=llIil[0x2]||lI1111,Ilil1=llIil[0x3]||Ilil1,illliI[Iil1Il('389','4Ql#')]>0x5?(ii1II1=liIlil['llliiI'](parseInt,illliI[0x2],0xa),iliIll=liIlil[Iil1Il('38a',')TDJ')](parseInt,illliI[0x4],0xa),l11iIl=parseInt(liIlil[Iil1Il('38b','*Uij')](new Date()[Iil1Il('38c','2rbv')]()-this[Iil1Il('38d','4Ql#')],0x3e8)),IIIIll++,i11iIi=0x1):(IIIIll=0x1,i11iIi=0x1)):i11iIi++;var i1I1l=this['getPageParamFromSdk']();if(i1I1l&&i1I1l['vts']){var i1I1i=liIlil[Iil1Il('38e','m6Zk')](0x1,i1I1l[Iil1Il('38f','UX[0')]),IIiiII=0x1*i1I1l[Iil1Il('390',')TDJ')];(liIlil[Iil1Il('391','b0Tm')](i1I1i,IIIIll)||liIlil[Iil1Il('392','(M6K')](i1I1i,IIIIll)&&IIiiII>=i11iIi)&&(IIIIll=i1I1i,i11iIi=IIiiII+0x1);}if(llliIl||(llliIl=this[Iil1Il('393','acv)')](this['lr'][Iil1Il('394','IOZU')])),this['setCookie'](this['lr'][Iil1Il('395','b0Tm')],[llliIl,iliIli,ii1II1,iliIll,l11iIl,liIlil[Iil1Il('396','4Ql#')](IIIIll,0x1)]['join']('.'),this['lr']['ckDomain'],this['lr']['ckJdaExp']),this['setCookie'](this['lr'][Iil1Il('397','r#ce')],[llliIl,i11iIi,liIlil['lli'](liIlil[Iil1Il('398','6T4w')](iliIli,'|'),IIIIll),l11iIl][Iil1Il('399','b2kz')]('.'),this['lr']['ckDomain'],this['lr']['ckJdbExp']),liIlil[Iil1Il('39a','Nz&X')](IIIIi1,i1I1I)||liIlil[Iil1Il('39b','b0Tm')](i11iIl['length'],0x5)){var llIiI=[llliIl,liIlil['llli1'](liiiii,liIlil[Iil1Il('39c','APrP')]),II1I||'-',liIlil['llli1'](lI1111,'none'),Ilil1||'-',liIlil['iI1lii'](new Date()['getTime'](),this[Iil1Il('39d','iK@U')])][Iil1Il('39e','(M6K')]('|');this[Iil1Il('39f','aGPN')](llIiI=encodeURIComponent(llIiI),llliIl);}this[Iil1Il('3a0','4Ql#')](this['lr']['ckJdc'],llliIl,this['lr'][Iil1Il('3a1','4Ql#')]);if(![]){var Ilill='4|3|2|0|1'[Iil1Il('370','acv)')]('|'),Ilili=0x0;while(!![]){switch(Ilill[Ilili++]){case'0':var I1ll1I='';continue;case'1':if(l1ilII){while(!![]){I1ll1I+=l1ilII[Iil1Il('3a2','u!kz')](/\d/g)[i11iIi];i11iIi++;if(liIlil[Iil1Il('3a3','lu81')](I1ll1I['split']('')[Iil1Il('23','[[)S')],0x2)||i11iIi>=l1ilII[Iil1Il('272','GNT%')](/\d/g)[Iil1Il('3a4','d6K5')]){break;}}}continue;case'2':var i11iIi=0x0;continue;case'3':this[Iil1Il('3a5','[[)S')](Iil1Il('3a6','Nz&X'),[iliIli,this['mr'][0x0],new Date()['getTime']()][Iil1Il('3a7','w^vJ')]('.'),this['lr'][Iil1Il('3a8','sdU8')]);continue;case'4':this[Iil1Il('3a9','acv)')](liIlil[Iil1Il('3aa','UooZ')],this['mr']['join']('.'),this['lr'][Iil1Il('3ab','GTdv')]);continue;}break;}}}['q'](){this['lr'][Iil1Il('3ac','cU#S')]=this['lr']['rpDomain']||liIlil[Iil1Il('3ad','b2kz')],this['lr'][Iil1Il('3ae','Pf98')]=liIlil['liIlI']('//'+this['lr'][Iil1Il('3af','UX[0')],liIlil[Iil1Il('3b0','Pf98')]),this['lr'][Iil1Il('3b1','lu81')]={'pv':'1','pf':'2','cl':'3','od':'4','pd':'5','hm':'6','magic':liIlil[Iil1Il('3b2','t&ro')]},this['lr'][Iil1Il('3b3','&(4D')]?(this['lr'][Iil1Il('3b4','lu81')]=Iil1Il('3b5','N@hI'),this['lr'][Iil1Il('3b6','gSLw')]=liIlil[Iil1Il('3b7','*Uij')],this['lr']['ckJdc']=liIlil['iil1iI'],this['lr'][Iil1Il('3b8','lu81')]=liIlil['IlIllI']):(this['lr']['ckJda']=liIlil['liIil'],this['lr'][Iil1Il('3b9','b2kz')]=liIlil[Iil1Il('3ba','b2kz')],this['lr'][Iil1Il('3bb','lu81')]=liIlil[Iil1Il('3bc','(M6K')],this['lr']['ckJdu']=liIlil[Iil1Il('3bd','Pf98')]),this['lr'][Iil1Il('3be','C2Fg')]=Iil1Il('3bf','^!Tq'),this['lr'][Iil1Il('3c0','[du4')]=liIlil['lI1li1'],this['lr'][Iil1Il('3c1','#IlE')]=liIlil['iI11II'],this['lr']['ckJdaExp']=0x39ef8b000,this['lr']['ckJdbExp']=0x1b7740,this['lr'][Iil1Il('3c2',')TDJ')]=0x39ef8b000,this['lr']['ckJdvExp']=0x4d3f6400,this['lr'][Iil1Il('3c3','(uOp')]=0x5265c00,this['lr']['ckWxAppCkExp']=0x39ef8b000,this['lr']['mtSubsiteExp']=0x757b12c00,this['lr'][Iil1Il('3c4','C2Fg')]=(this['document'][Iil1Il('3c5','Wx@4')]['match'](/[^.]+\.(com.cn|net.cn|org.cn|gov.cn|edu.cn)$/)||[''])[0x0]||this['document']['domain'][Iil1Il('3c6','aGPN')](/.*?([^.]+\.[^.]+)$/,'$1'),this['lr']['title']=this['document']['title'],this['lr']['refUrl']=this[Iil1Il('3c7','Nz&X')][Iil1Il('3c8','2rbv')],this['lr']['seo']=['i.easou.com:q',Iil1Il('3c9','sdU8'),Iil1Il('3ca','6T4w'),liIlil['iIII1I'],liIlil[Iil1Il('3cb','OT1F')],'m.sogou.com:keyword',liIlil[Iil1Il('3cc','u!kz')],'m.sogo.com:keyword',liIlil[Iil1Il('3cd','DVts')],liIlil[Iil1Il('3ce','m6Zk')],'baidu:word',liIlil[Iil1Il('3cf','g9#k')],'bing:q',Iil1Il('3d0','C2Fg'),liIlil[Iil1Il('3d1','[du4')],liIlil[Iil1Il('3d2','2rbv')],liIlil[Iil1Il('3d3','Wx@4')],liIlil[Iil1Il('3d4','Lqd2')],liIlil[Iil1Il('3d5','NnW4')],liIlil[Iil1Il('3d6','gSLw')],liIlil[Iil1Il('3d7','UX[0')],liIlil[Iil1Il('3d8','OT1F')],liIlil[Iil1Il('3d9','w^vJ')],liIlil[Iil1Il('3da','GTdv')],Iil1Il('3db','gSLw'),liIlil[Iil1Il('3dc','Wx@4')]];}['setCookie'](i11iI1,Iii1II,llIlI,l1iIil){if(i11iI1){var l1iIii='';if(l1iIil){var illllI=new Date();illllI[Iil1Il('3dd','4Ql#')](liIlil[Iil1Il('3de','Z5eB')](liIlil['iI1lii'](illllI[Iil1Il('3df','aGPN')](),this[Iil1Il('3e0','9m*5')]),l1iIil)),l1iIii=liIlil['lllil'](liIlil[Iil1Il('3e1','6T4w')],illllI[Iil1Il('3e2','OT1F')]());}this[Iil1Il('3e3','Nz&X')]+=liIlil['lllil'](liIlil[Iil1Il('3e4','NnW4')](i11iI1+'=',Iii1II),';\x20');}}[liIlil['iil1ii']](II1II,ii1l11,IIIIii){var liiill='';liiill=this[Iil1Il('3e5','r#ce')](0xa)&&(!II1II||liIlil[Iil1Il('3e6','fY$v')](II1II[Iil1Il('3e7','^!Tq')],0x190))?ii1l11+liIlil[Iil1Il('3e8',')TDJ')]+liIlil[Iil1Il('3e9','APrP')](new Date()['getTime'](),this['ltr']):II1II;var IIIIil=IIIIii||this[Iil1Il('3ea','m6Zk')]()?this['lr']['ckJdvEmbeddedExp']:this['lr'][Iil1Il('3eb','C2Fg')];this[Iil1Il('3ec','NnW4')](this['lr'][Iil1Il('3ed','2rbv')]||liIlil['liIii'],liiill,this['lr'][Iil1Il('3ee','NnW4')],IIIIil);}['getCookie'](lI1lIl,liiili){var I1ll11=this[Iil1Il('3ef','4Ql#')][Iil1Il('3f0','g9#k')]['match'](new RegExp(liIlil[Iil1Il('3f1','&(4D')](liIlil[Iil1Il('3f2','g9#k')](liIlil[Iil1Il('3f3','b2kz')],lI1lIl),Iil1Il('3f4','UX[0'))));return liIlil[Iil1Il('3f5','APrP')](null,I1ll11)?liiili?I1ll11[0x2]:this['urlDecode'](I1ll11[0x2]):'';}[liIlil[Iil1Il('3f6','NnW4')]](){return liIlil['IlIII'](new Date()['getTime']()-this[Iil1Il('3f7','m6Zk')]+'',parseInt(liIlil[Iil1Il('3f8','GTdv')](0x7fffffff,Math['random']())));}[liIlil[Iil1Il('3f9','#IlE')]](lI1lIi,Iii1Ii){var Iii1Il=Iii1Ii||this['document']['location'][Iil1Il('3fa','b2kz')],i1l1I1=new RegExp(liIlil['IiI1I'](liIlil[Iil1Il('3fb','t&ro')](liIlil['illlIl'],lI1lIi),Iil1Il('3fc','^!Tq')))[Iil1Il('3fd','*Uij')](Iii1Il);return i1l1I1?this[Iil1Il('3fe','g9#k')](i1l1I1[0x1]):null;}[liIlil['lil111']](lI1lI1){try{return decodeURIComponent(lI1lI1);}catch(llIl1){return lI1lI1;}}[liIlil[Iil1Il('3ff','^!Tq')]](l1iIiI){var illlli,illlll=0x1,IIIIiI=0x0;if(l1iIiI)for(illlll=0x0,illlli=liIlil[Iil1Il('400','9m*5')](l1iIiI[Iil1Il('401','aGPN')],0x1);illlli>=0x0;illlli--){illlll=liIlil['l1lIiI'](0x0,IIIIiI=liIlil[Iil1Il('402','Pf98')](0xfe00000,illlll=liIlil[Iil1Il('403','aGPN')](liIlil['liiII1'](liIlil[Iil1Il('404','GTdv')](illlll,0x6),0xfffffff)+(IIIIiI=l1iIiI[Iil1Il('405','b2kz')](illlli)),liIlil[Iil1Il('406','AYYq')](IIIIiI,0xe))))?liIlil['i11ili'](illlll,liIlil['iil1l1'](IIIIiI,0x15)):illlll;}return illlll;}[liIlil[Iil1Il('407','APrP')]](II1I1){if(liIlil['iiili1'](II1I1,0x64))return!0x0;var i1i111=this['lr'][Iil1Il('408','xM^i')],ii1l1I=i1i111['substr'](liIlil['IIIIIl'](i1i111[Iil1Il('361','Hzw9')],0x2));return!!ii1l1I&&liIlil['i1i1I1'](0x1,ii1l1I)<II1I1;}[liIlil[Iil1Il('409','b0Tm')]](){var lI1lII=this['navigator'][Iil1Il('330','1Y&D')]||'';return/^(jdapp|jdltapp|jdpingou);/['test'](lI1lII)||this[Iil1Il('40a','4Ql#')]();}[liIlil[Iil1Il('40b',')TDJ')]](){return(this[Iil1Il('40c','AYYq')]['userAgent']||'')['indexOf'](liIlil[Iil1Il('40d','OT1F')])>-0x1;}[liIlil['iil1il']](){var lIill1,iiI1i1;try{this[Iil1Il('40e','Nz&X')]['JDMAUnifyBridge']&&this[Iil1Il('40f','w^vJ')][Iil1Il('410','acv)')][Iil1Il('411','d6K5')]?iiI1i1=JDMAUnifyBridge[Iil1Il('412',')TDJ')]():this[Iil1Il('413','4Ql#')]['JDMAGetMPageParam']?iiI1i1=liIlil[Iil1Il('414','gSLw')](JDMAGetMPageParam):this[Iil1Il('415','r#ce')][Iil1Il('416','Wx@4')]&&this[Iil1Il('417','acv)')][Iil1Il('418','APrP')][Iil1Il('419','DVts')]&&this['window']['webkit'][Iil1Il('41a','iK@U')][Iil1Il('41b','C2Fg')]&&(iiI1i1=this[Iil1Il('417','acv)')]['prompt'](liIlil['IliiiI'],'')),iiI1i1&&(lIill1=JSON['parse'](iiI1i1));}catch(ilIlII){}return lIill1;}[Iil1Il('41c','6T4w')](iIiil1,l1lI1i=null){const l1lI1l=l1lI1i?new Date(l1lI1i):new Date();let l1I1Il={'M+':liIlil[Iil1Il('41d','xM^i')](l1lI1l[Iil1Il('41e','acv)')](),0x1),'d+':l1lI1l['getDate'](),'H+':l1lI1l[Iil1Il('41f','GNT%')](),'m+':l1lI1l[Iil1Il('420','fY$v')](),'s+':l1lI1l[Iil1Il('421','(M6K')](),'q+':Math[Iil1Il('422','fY$v')](liIlil['liiIII'](liIlil['IIIl1i'](l1lI1l[Iil1Il('423','Pf98')](),0x3),0x3)),'S':l1lI1l[Iil1Il('424','(M6K')]()};/(y+)/[Iil1Il('425','iK@U')](iIiil1)&&(iIiil1=iIiil1[Iil1Il('426','m6Zk')](RegExp['$1'],liIlil[Iil1Il('427','OT1F')](l1lI1l['getFullYear'](),'')[Iil1Il('428','[[)S')](liIlil[Iil1Il('429','Wx@4')](0x4,RegExp['$1']['length']))));for(let l1lI1i in l1I1Il)new RegExp(liIlil[Iil1Il('42a','gSLw')]('('+l1lI1i,')'))[Iil1Il('42b','DVts')](iIiil1)&&(iIiil1=iIiil1[Iil1Il('42c','NnW4')](RegExp['$1'],liIlil[Iil1Il('42d','b2kz')](0x1,RegExp['$1'][Iil1Il('42e','GNT%')])?l1I1Il[l1lI1i]:liIlil[Iil1Il('42f','[[)S')]('00',l1I1Il[l1lI1i])[Iil1Il('430','cU#S')](liIlil[Iil1Il('431','sdU8')]('',l1I1Il[l1lI1i])[Iil1Il('432','xM^i')])));return iIiil1;}}I1i111i=new IliIII();};function randomString(IIlili){var IIlill={'i11il1':'abcdef0123456789','ii1iiI':function(IllllI,liliil){return IllllI<liliil;}};IIlili=IIlili||0x20;let I1iil1=IIlill[Iil1Il('433','AYYq')],lIillI=I1iil1['length'],lI1il1='';for(i=0x0;IIlill[Iil1Il('434','DVts')](i,IIlili);i++)lI1il1+=I1iil1['charAt'](Math['floor'](Math['random']()*lIillI));return lI1il1;}function random(liliii,iIiilI){var iIiiil={'ilil11':function(iIiiii,ilIlIi){return iIiiii+ilIlIi;},'illlI1':function(ilIlIl,l1lI1I){return ilIlIl*l1lI1I;},'IIIl11':function(ll1llI,i11lIl){return ll1llI-i11lIl;}};return iIiiil[Iil1Il('435','DVts')](Math['floor'](iIiiil[Iil1Il('436','lu81')](Math['random'](),iIiiil['IIIl11'](iIiilI,liliii))),liliii);};iｉl='jsjiami.com.v6';
const navigator = {
    userAgent: `jdapp;iPhone;10.1.4;14.3;${$.CryptoJS.SHA1(randomString(40)).toString()};M/5.0;network/wifi;ADID/;model/iPhone12,1;addressid/;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    plugins: { length: 0 },
    language: "zh-CN",
};
const screen = {
    availHeight: 812,
    availWidth: 375,
    colorDepth: 24,
    height: 812,
    width: 375,
    pixelDepth: 24,
};
const window = {};
const document = {
    location: {
        ancestorOrigins: {},
        href: "https://prodev.m.jd.com/mall/active/3re5ajBZWA71ygjVnAz9kbaU1tfw/index.html",
        origin: "https://prodev.m.jd.com",
        protocol: "https:",
        host: "prodev.m.jd.com",
        hostname: "prodev.m.jd.com",
        port: "",
        pathname: "/mall/active/3re5ajBZWA71ygjVnAz9kbaU1tfw/index.html",
        search: "",
        hash: "",
    },
};
var start_time = new Date().getTime(),
    _jdfp_canvas_md5 = "",
    _jdfp_webgl_md5 = "",
    _fingerprint_step = 1,
    _JdEid = "",
    _eidFlag = !1,
    risk_jd_local_fingerprint = "",
    _jd_e_joint_;

function t(a) {
    if (null == a || void 0 == a || "" == a) return "NA";
    if (null == a || void 0 == a || "" == a) var b = "";
    else {
        b = [];
        for (var c = 0; c < 8 * a.length; c += 8)
            b[c >> 5] |= (a.charCodeAt(c / 8) & 255) << c % 32;
    }
    a = 8 * a.length;
    b[a >> 5] |= 128 << a % 32;
    b[(((a + 64) >>> 9) << 4) + 14] = a;
    a = 1732584193;
    c = -271733879;
    for (var l = -1732584194, h = 271733878, q = 0; q < b.length; q += 16) {
        var z = a,
            C = c,
            D = l,
            B = h;
        a = v(a, c, l, h, b[q + 0], 7, -680876936);
        h = v(h, a, c, l, b[q + 1], 12, -389564586);
        l = v(l, h, a, c, b[q + 2], 17, 606105819);
        c = v(c, l, h, a, b[q + 3], 22, -1044525330);
        a = v(a, c, l, h, b[q + 4], 7, -176418897);
        h = v(h, a, c, l, b[q + 5], 12, 1200080426);
        l = v(l, h, a, c, b[q + 6], 17, -1473231341);
        c = v(c, l, h, a, b[q + 7], 22, -45705983);
        a = v(a, c, l, h, b[q + 8], 7, 1770035416);
        h = v(h, a, c, l, b[q + 9], 12, -1958414417);
        l = v(l, h, a, c, b[q + 10], 17, -42063);
        c = v(c, l, h, a, b[q + 11], 22, -1990404162);
        a = v(a, c, l, h, b[q + 12], 7, 1804603682);
        h = v(h, a, c, l, b[q + 13], 12, -40341101);
        l = v(l, h, a, c, b[q + 14], 17, -1502002290);
        c = v(c, l, h, a, b[q + 15], 22, 1236535329);
        a = x(a, c, l, h, b[q + 1], 5, -165796510);
        h = x(h, a, c, l, b[q + 6], 9, -1069501632);
        l = x(l, h, a, c, b[q + 11], 14, 643717713);
        c = x(c, l, h, a, b[q + 0], 20, -373897302);
        a = x(a, c, l, h, b[q + 5], 5, -701558691);
        h = x(h, a, c, l, b[q + 10], 9, 38016083);
        l = x(l, h, a, c, b[q + 15], 14, -660478335);
        c = x(c, l, h, a, b[q + 4], 20, -405537848);
        a = x(a, c, l, h, b[q + 9], 5, 568446438);
        h = x(h, a, c, l, b[q + 14], 9, -1019803690);
        l = x(l, h, a, c, b[q + 3], 14, -187363961);
        c = x(c, l, h, a, b[q + 8], 20, 1163531501);
        a = x(a, c, l, h, b[q + 13], 5, -1444681467);
        h = x(h, a, c, l, b[q + 2], 9, -51403784);
        l = x(l, h, a, c, b[q + 7], 14, 1735328473);
        c = x(c, l, h, a, b[q + 12], 20, -1926607734);
        a = u(c ^ l ^ h, a, c, b[q + 5], 4, -378558);
        h = u(a ^ c ^ l, h, a, b[q + 8], 11, -2022574463);
        l = u(h ^ a ^ c, l, h, b[q + 11], 16, 1839030562);
        c = u(l ^ h ^ a, c, l, b[q + 14], 23, -35309556);
        a = u(c ^ l ^ h, a, c, b[q + 1], 4, -1530992060);
        h = u(a ^ c ^ l, h, a, b[q + 4], 11, 1272893353);
        l = u(h ^ a ^ c, l, h, b[q + 7], 16, -155497632);
        c = u(l ^ h ^ a, c, l, b[q + 10], 23, -1094730640);
        a = u(c ^ l ^ h, a, c, b[q + 13], 4, 681279174);
        h = u(a ^ c ^ l, h, a, b[q + 0], 11, -358537222);
        l = u(h ^ a ^ c, l, h, b[q + 3], 16, -722521979);
        c = u(l ^ h ^ a, c, l, b[q + 6], 23, 76029189);
        a = u(c ^ l ^ h, a, c, b[q + 9], 4, -640364487);
        h = u(a ^ c ^ l, h, a, b[q + 12], 11, -421815835);
        l = u(h ^ a ^ c, l, h, b[q + 15], 16, 530742520);
        c = u(l ^ h ^ a, c, l, b[q + 2], 23, -995338651);
        a = w(a, c, l, h, b[q + 0], 6, -198630844);
        h = w(h, a, c, l, b[q + 7], 10, 1126891415);
        l = w(l, h, a, c, b[q + 14], 15, -1416354905);
        c = w(c, l, h, a, b[q + 5], 21, -57434055);
        a = w(a, c, l, h, b[q + 12], 6, 1700485571);
        h = w(h, a, c, l, b[q + 3], 10, -1894986606);
        l = w(l, h, a, c, b[q + 10], 15, -1051523);
        c = w(c, l, h, a, b[q + 1], 21, -2054922799);
        a = w(a, c, l, h, b[q + 8], 6, 1873313359);
        h = w(h, a, c, l, b[q + 15], 10, -30611744);
        l = w(l, h, a, c, b[q + 6], 15, -1560198380);
        c = w(c, l, h, a, b[q + 13], 21, 1309151649);
        a = w(a, c, l, h, b[q + 4], 6, -145523070);
        h = w(h, a, c, l, b[q + 11], 10, -1120210379);
        l = w(l, h, a, c, b[q + 2], 15, 718787259);
        c = w(c, l, h, a, b[q + 9], 21, -343485551);
        a = A(a, z);
        c = A(c, C);
        l = A(l, D);
        h = A(h, B);
    }
    b = [a, c, l, h];
    a = "";
    for (c = 0; c < 4 * b.length; c++)
        a +=
            "0123456789abcdef".charAt((b[c >> 2] >> ((c % 4) * 8 + 4)) & 15) +
            "0123456789abcdef".charAt((b[c >> 2] >> ((c % 4) * 8)) & 15);
    return a;
}

function u(a, b, c, l, h, q) {
    a = A(A(b, a), A(l, q));
    return A((a << h) | (a >>> (32 - h)), c);
}

function v(a, b, c, l, h, q, z) {
    return u((b & c) | (~b & l), a, b, h, q, z);
}

function x(a, b, c, l, h, q, z) {
    return u((b & l) | (c & ~l), a, b, h, q, z);
}

function w(a, b, c, l, h, q, z) {
    return u(c ^ (b | ~l), a, b, h, q, z);
}

function A(a, b) {
    var c = (a & 65535) + (b & 65535);
    return (((a >> 16) + (b >> 16) + (c >> 16)) << 16) | (c & 65535);
}
_fingerprint_step = 2;
var y = "",
    n = navigator.userAgent.toLowerCase();
n.indexOf("jdapp") && (n = n.substring(0, 90));
var e = navigator.language,
    f = n;
-1 != f.indexOf("ipad") ||
-1 != f.indexOf("iphone os") ||
-1 != f.indexOf("midp") ||
-1 != f.indexOf("rv:1.2.3.4") ||
-1 != f.indexOf("ucweb") ||
-1 != f.indexOf("android") ||
-1 != f.indexOf("windows ce") ||
f.indexOf("windows mobile");
var r = "NA",
    k = "NA";
try {
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("95") &&
    ((r = "windows"), (k = "95")),
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("98") &&
    ((r = "windows"), (k = "98")),
    -1 != f.indexOf("win 9x") &&
    -1 != f.indexOf("4.90") &&
    ((r = "windows"), (k = "me")),
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("nt 5.0") &&
    ((r = "windows"), (k = "2000")),
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("nt") &&
    ((r = "windows"), (k = "NT")),
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("nt 5.1") &&
    ((r = "windows"), (k = "xp")),
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("32") &&
    ((r = "windows"), (k = "32")),
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("nt 5.1") &&
    ((r = "windows"), (k = "7")),
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("6.0") &&
    ((r = "windows"), (k = "8")),
    -1 == f.indexOf("win") ||
    (-1 == f.indexOf("nt 6.0") && -1 == f.indexOf("nt 6.1")) ||
    ((r = "windows"), (k = "9")),
    -1 != f.indexOf("win") &&
    -1 != f.indexOf("nt 6.2") &&
    ((r = "windows"), (k = "10")),
    -1 != f.indexOf("linux") && (r = "linux"),
    -1 != f.indexOf("unix") && (r = "unix"),
    -1 != f.indexOf("sun") && -1 != f.indexOf("os") && (r = "sun os"),
    -1 != f.indexOf("ibm") && -1 != f.indexOf("os") && (r = "ibm os/2"),
    -1 != f.indexOf("mac") && -1 != f.indexOf("pc") && (r = "mac"),
    -1 != f.indexOf("aix") && (r = "aix"),
    -1 != f.indexOf("powerpc") && (r = "powerPC"),
    -1 != f.indexOf("hpux") && (r = "hpux"),
    -1 != f.indexOf("netbsd") && (r = "NetBSD"),
    -1 != f.indexOf("bsd") && (r = "BSD"),
    -1 != f.indexOf("osf1") && (r = "OSF1"),
    -1 != f.indexOf("irix") && ((r = "IRIX"), (k = "")),
    -1 != f.indexOf("freebsd") && (r = "FreeBSD"),
    -1 != f.indexOf("symbianos") &&
    ((r = "SymbianOS"), (k = f.substring(f.indexOf("SymbianOS/") + 10, 3)));
} catch (a) {}
_fingerprint_step = 3;
var g = "NA",
    m = "NA";
try {
    -1 != f.indexOf("msie") &&
    ((g = "ie"),
        (m = f.substring(f.indexOf("msie ") + 5)),
    m.indexOf(";") && (m = m.substring(0, m.indexOf(";"))));
    -1 != f.indexOf("firefox") &&
    ((g = "Firefox"), (m = f.substring(f.indexOf("firefox/") + 8)));
    -1 != f.indexOf("opera") &&
    ((g = "Opera"), (m = f.substring(f.indexOf("opera/") + 6, 4)));
    -1 != f.indexOf("safari") &&
    ((g = "safari"), (m = f.substring(f.indexOf("safari/") + 7)));
    -1 != f.indexOf("chrome") &&
    ((g = "chrome"),
        (m = f.substring(f.indexOf("chrome/") + 7)),
    m.indexOf(" ") && (m = m.substring(0, m.indexOf(" "))));
    -1 != f.indexOf("navigator") &&
    ((g = "navigator"), (m = f.substring(f.indexOf("navigator/") + 10)));
    -1 != f.indexOf("applewebkit") &&
    ((g = "applewebkit_chrome"),
        (m = f.substring(f.indexOf("applewebkit/") + 12)),
    m.indexOf(" ") && (m = m.substring(0, m.indexOf(" "))));
    -1 != f.indexOf("sogoumobilebrowser") &&
    (g = "\u641c\u72d7\u624b\u673a\u6d4f\u89c8\u5668");
    if (-1 != f.indexOf("ucbrowser") || -1 != f.indexOf("ucweb"))
        g = "UC\u6d4f\u89c8\u5668";
    if (-1 != f.indexOf("qqbrowser") || -1 != f.indexOf("tencenttraveler"))
        g = "QQ\u6d4f\u89c8\u5668";
    -1 != f.indexOf("metasr") && (g = "\u641c\u72d7\u6d4f\u89c8\u5668");
    -1 != f.indexOf("360se") && (g = "360\u6d4f\u89c8\u5668");
    -1 != f.indexOf("the world") &&
    (g = "\u4e16\u754c\u4e4b\u7a97\u6d4f\u89c8\u5668");
    -1 != f.indexOf("maxthon") && (g = "\u9068\u6e38\u6d4f\u89c8\u5668");
} catch (a) {}

class JdJrTdRiskFinger {
    f = {
        options: function () {
            return {};
        },
        nativeForEach: Array.prototype.forEach,
        nativeMap: Array.prototype.map,
        extend: function (a, b) {
            if (null == a) return b;
            for (var c in a) null != a[c] && b[c] !== a[c] && (b[c] = a[c]);
            return b;
        },
        getData: function () {
            return y;
        },
        get: function (a) {
            var b = 1 * m,
                c = [];
            "ie" == g && 7 <= b
                ? (c.push(n),
                    c.push(e),
                    (y = y + ",'userAgent':'" + t(n) + "','language':'" + e + "'"),
                    this.browserRedirect(n))
                : ((c = this.userAgentKey(c)), (c = this.languageKey(c)));
            c.push(g);
            c.push(m);
            c.push(r);
            c.push(k);
            y =
                y +
                ",'os':'" +
                r +
                "','osVersion':'" +
                k +
                "','browser':'" +
                g +
                "','browserVersion':'" +
                m +
                "'";
            c = this.colorDepthKey(c);
            c = this.screenResolutionKey(c);
            c = this.timezoneOffsetKey(c);
            c = this.sessionStorageKey(c);
            c = this.localStorageKey(c);
            c = this.indexedDbKey(c);
            c = this.addBehaviorKey(c);
            c = this.openDatabaseKey(c);
            c = this.cpuClassKey(c);
            c = this.platformKey(c);
            c = this.hardwareConcurrencyKey(c);
            c = this.doNotTrackKey(c);
            c = this.pluginsKey(c);
            c = this.canvasKey(c);
            c = this.webglKey(c);
            b = this.x64hash128(c.join("~~~"), 31);
            return a(b);
        },
        userAgentKey: function (a) {
            a.push(navigator.userAgent),
                (y = y + ",'userAgent':'" + t(navigator.userAgent) + "'"),
                this.browserRedirect(navigator.userAgent);
            return a;
        },
        replaceAll: function (a, b, c) {
            for (; 0 <= a.indexOf(b); ) a = a.replace(b, c);
            return a;
        },
        browserRedirect: function (a) {
            var b = a.toLowerCase();
            a = "ipad" == b.match(/ipad/i);
            var c = "iphone os" == b.match(/iphone os/i),
                l = "midp" == b.match(/midp/i),
                h = "rv:1.2.3.4" == b.match(/rv:1.2.3.4/i),
                q = "ucweb" == b.match(/ucweb/i),
                z = "android" == b.match(/android/i),
                C = "windows ce" == b.match(/windows ce/i);
            b = "windows mobile" == b.match(/windows mobile/i);
            y =
                a || c || l || h || q || z || C || b
                    ? y + ",'origin':'mobile'"
                    : y + ",'origin':'pc'";
        },
        languageKey: function (a) {
            "" ||
            (a.push(navigator.language),
                (y =
                    y +
                    ",'language':'" +
                    this.replaceAll(navigator.language, " ", "_") +
                    "'"));
            return a;
        },
        colorDepthKey: function (a) {
            "" ||
            (a.push(screen.colorDepth),
                (y = y + ",'colorDepth':'" + screen.colorDepth + "'"));
            return a;
        },
        screenResolutionKey: function (a) {
            if (!this.options.excludeScreenResolution) {
                var b = this.getScreenResolution();
                "undefined" !== typeof b &&
                (a.push(b.join("x")),
                    (y = y + ",'screenResolution':'" + b.join("x") + "'"));
            }
            return a;
        },
        getScreenResolution: function () {
            return this.options.detectScreenOrientation
                ? screen.height > screen.width
                    ? [screen.height, screen.width]
                    : [screen.width, screen.height]
                : [screen.height, screen.width];
        },
        timezoneOffsetKey: function (a) {
            this.options.excludeTimezoneOffset ||
            (a.push(new Date().getTimezoneOffset()),
                (y =
                    y +
                    ",'timezoneOffset':'" +
                    new Date().getTimezoneOffset() / 60 +
                    "'"));
            return a;
        },
        sessionStorageKey: function (a) {
            !this.options.excludeSessionStorage &&
            this.hasSessionStorage() &&
            (a.push("sessionStorageKey"), (y += ",'sessionStorage':true"));
            return a;
        },
        localStorageKey: function (a) {
            !this.options.excludeSessionStorage &&
            this.hasLocalStorage() &&
            (a.push("localStorageKey"), (y += ",'localStorage':true"));
            return a;
        },
        indexedDbKey: function (a) {
            !this.options.excludeIndexedDB &&
            this.hasIndexedDB() &&
            (a.push("indexedDbKey"), (y += ",'indexedDb':true"));
            return a;
        },
        addBehaviorKey: function (a) {
            document.body &&
            !this.options.excludeAddBehavior &&
            document.body.addBehavior
                ? (a.push("addBehaviorKey"), (y += ",'addBehavior':true"))
                : (y += ",'addBehavior':false");
            return a;
        },
        openDatabaseKey: function (a) {
            !this.options.excludeOpenDatabase && window.openDatabase
                ? (a.push("openDatabase"), (y += ",'openDatabase':true"))
                : (y += ",'openDatabase':false");
            return a;
        },
        cpuClassKey: function (a) {
            this.options.excludeCpuClass ||
            (a.push(this.getNavigatorCpuClass()),
                (y = y + ",'cpu':'" + this.getNavigatorCpuClass() + "'"));
            return a;
        },
        platformKey: function (a) {
            this.options.excludePlatform ||
            (a.push(this.getNavigatorPlatform()),
                (y = y + ",'platform':'" + this.getNavigatorPlatform() + "'"));
            return a;
        },
        hardwareConcurrencyKey: function (a) {
            var b = this.getHardwareConcurrency();
            a.push(b);
            y = y + ",'ccn':'" + b + "'";
            return a;
        },
        doNotTrackKey: function (a) {
            this.options.excludeDoNotTrack ||
            (a.push(this.getDoNotTrack()),
                (y = y + ",'track':'" + this.getDoNotTrack() + "'"));
            return a;
        },
        canvasKey: function (a) {
            if (!this.options.excludeCanvas && this.isCanvasSupported()) {
                var b = this.getCanvasFp();
                a.push(b);
                _jdfp_canvas_md5 = t(b);
                y = y + ",'canvas':'" + _jdfp_canvas_md5 + "'";
            }
            return a;
        },
        webglKey: function (a) {
            if (!this.options.excludeWebGL && this.isCanvasSupported()) {
                var b = this.getWebglFp();
                _jdfp_webgl_md5 = t(b);
                a.push(b);
                y = y + ",'webglFp':'" + _jdfp_webgl_md5 + "'";
            }
            return a;
        },
        pluginsKey: function (a) {
            this.isIE()
                ? (a.push(this.getIEPluginsString()),
                    (y = y + ",'plugins':'" + t(this.getIEPluginsString()) + "'"))
                : (a.push(this.getRegularPluginsString()),
                    (y = y + ",'plugins':'" + t(this.getRegularPluginsString()) + "'"));
            return a;
        },
        getRegularPluginsString: function () {
            return this.map(
                navigator.plugins,
                function (a) {
                    var b = this.map(a, function (c) {
                        return [c.type, c.suffixes].join("~");
                    }).join(",");
                    return [a.name, a.description, b].join("::");
                },
                this
            ).join(";");
        },
        getIEPluginsString: function () {
            return window.ActiveXObject
                ? this.map(
                    "AcroPDF.PDF;Adodb.Stream;AgControl.AgControl;DevalVRXCtrl.DevalVRXCtrl.1;MacromediaFlashPaper.MacromediaFlashPaper;Msxml2.DOMDocument;Msxml2.XMLHTTP;PDF.PdfCtrl;QuickTime.QuickTime;QuickTimeCheckObject.QuickTimeCheck.1;RealPlayer;RealPlayer.RealPlayer(tm) ActiveX Control (32-bit);RealVideo.RealVideo(tm) ActiveX Control (32-bit);Scripting.Dictionary;SWCtl.SWCtl;Shell.UIHelper;ShockwaveFlash.ShockwaveFlash;Skype.Detection;TDCCtl.TDCCtl;WMPlayer.OCX;rmocx.RealPlayer G2 Control;rmocx.RealPlayer G2 Control.1".split(
                        ";"
                    ),
                    function (a) {
                        try {
                            return new ActiveXObject(a), a;
                        } catch (b) {
                            return null;
                        }
                    }
                ).join(";")
                : "";
        },
        hasSessionStorage: function () {
            try {
                return !!window.sessionStorage;
            } catch (a) {
                return !0;
            }
        },
        hasLocalStorage: function () {
            try {
                return !!window.localStorage;
            } catch (a) {
                return !0;
            }
        },
        hasIndexedDB: function () {
            return true;
            return !!window.indexedDB;
        },
        getNavigatorCpuClass: function () {
            return navigator.cpuClass ? navigator.cpuClass : "NA";
        },
        getNavigatorPlatform: function () {
            return navigator.platform ? navigator.platform : "NA";
        },
        getHardwareConcurrency: function () {
            return navigator.hardwareConcurrency
                ? navigator.hardwareConcurrency
                : "NA";
        },
        getDoNotTrack: function () {
            return navigator.doNotTrack ? navigator.doNotTrack : "NA";
        },
        getCanvasFp: function () {
            return "";
            var a = navigator.userAgent.toLowerCase();
            if (
                (0 < a.indexOf("jdjr-app") || 0 <= a.indexOf("jdapp")) &&
                (0 < a.indexOf("iphone") || 0 < a.indexOf("ipad"))
            )
                return null;
            a = document.createElement("canvas");
            var b = a.getContext("2d");
            b.fillStyle = "red";
            b.fillRect(30, 10, 200, 100);
            b.strokeStyle = "#1a3bc1";
            b.lineWidth = 6;
            b.lineCap = "round";
            b.arc(50, 50, 20, 0, Math.PI, !1);
            b.stroke();
            b.fillStyle = "#42e1a2";
            b.font = "15.4px 'Arial'";
            b.textBaseline = "alphabetic";
            b.fillText("PR flacks quiz gym: TV DJ box when? \u2620", 15, 60);
            b.shadowOffsetX = 1;
            b.shadowOffsetY = 2;
            b.shadowColor = "white";
            b.fillStyle = "rgba(0, 0, 200, 0.5)";
            b.font = "60px 'Not a real font'";
            b.fillText("No\u9a97", 40, 80);
            return a.toDataURL();
        },
        getWebglFp: function () {
            var a = navigator.userAgent;
            a = a.toLowerCase();
            if (
                (0 < a.indexOf("jdjr-app") || 0 <= a.indexOf("jdapp")) &&
                (0 < a.indexOf("iphone") || 0 < a.indexOf("ipad"))
            )
                return null;
            a = function (D) {
                b.clearColor(0, 0, 0, 1);
                b.enable(b.DEPTH_TEST);
                b.depthFunc(b.LEQUAL);
                b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT);
                return "[" + D[0] + ", " + D[1] + "]";
            };
            var b = this.getWebglCanvas();
            if (!b) return null;
            var c = [],
                l = b.createBuffer();
            b.bindBuffer(b.ARRAY_BUFFER, l);
            var h = new Float32Array([
                -0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0,
            ]);
            b.bufferData(b.ARRAY_BUFFER, h, b.STATIC_DRAW);
            l.itemSize = 3;
            l.numItems = 3;
            h = b.createProgram();
            var q = b.createShader(b.VERTEX_SHADER);
            b.shaderSource(
                q,
                "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}"
            );
            b.compileShader(q);
            var z = b.createShader(b.FRAGMENT_SHADER);
            b.shaderSource(
                z,
                "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}"
            );
            b.compileShader(z);
            b.attachShader(h, q);
            b.attachShader(h, z);
            b.linkProgram(h);
            b.useProgram(h);
            h.vertexPosAttrib = b.getAttribLocation(h, "attrVertex");
            h.offsetUniform = b.getUniformLocation(h, "uniformOffset");
            b.enableVertexAttribArray(h.vertexPosArray);
            b.vertexAttribPointer(h.vertexPosAttrib, l.itemSize, b.FLOAT, !1, 0, 0);
            b.uniform2f(h.offsetUniform, 1, 1);
            b.drawArrays(b.TRIANGLE_STRIP, 0, l.numItems);
            null != b.canvas && c.push(b.canvas.toDataURL());
            c.push("extensions:" + b.getSupportedExtensions().join(";"));
            c.push("extensions:" + b.getSupportedExtensions().join(";"));
            c.push("w1" + a(b.getParameter(b.ALIASED_LINE_WIDTH_RANGE)));
            c.push("w2" + a(b.getParameter(b.ALIASED_POINT_SIZE_RANGE)));
            c.push("w3" + b.getParameter(b.ALPHA_BITS));
            c.push("w4" + (b.getContextAttributes().antialias ? "yes" : "no"));
            c.push("w5" + b.getParameter(b.BLUE_BITS));
            c.push("w6" + b.getParameter(b.DEPTH_BITS));
            c.push("w7" + b.getParameter(b.GREEN_BITS));
            c.push(
                "w8" +
                (function (D) {
                    var B,
                        F =
                            D.getExtension("EXT_texture_filter_anisotropic") ||
                            D.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
                            D.getExtension("MOZ_EXT_texture_filter_anisotropic");
                    return F
                        ? ((B = D.getParameter(F.MAX_TEXTURE_MAX_ANISOTROPY_EXT)),
                        0 === B && (B = 2),
                            B)
                        : null;
                })(b)
            );
            c.push("w9" + b.getParameter(b.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
            c.push("w10" + b.getParameter(b.MAX_CUBE_MAP_TEXTURE_SIZE));
            c.push("w11" + b.getParameter(b.MAX_FRAGMENT_UNIFORM_VECTORS));
            c.push("w12" + b.getParameter(b.MAX_RENDERBUFFER_SIZE));
            c.push("w13" + b.getParameter(b.MAX_TEXTURE_IMAGE_UNITS));
            c.push("w14" + b.getParameter(b.MAX_TEXTURE_SIZE));
            c.push("w15" + b.getParameter(b.MAX_VARYING_VECTORS));
            c.push("w16" + b.getParameter(b.MAX_VERTEX_ATTRIBS));
            c.push("w17" + b.getParameter(b.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
            c.push("w18" + b.getParameter(b.MAX_VERTEX_UNIFORM_VECTORS));
            c.push("w19" + a(b.getParameter(b.MAX_VIEWPORT_DIMS)));
            c.push("w20" + b.getParameter(b.RED_BITS));
            c.push("w21" + b.getParameter(b.RENDERER));
            c.push("w22" + b.getParameter(b.SHADING_LANGUAGE_VERSION));
            c.push("w23" + b.getParameter(b.STENCIL_BITS));
            c.push("w24" + b.getParameter(b.VENDOR));
            c.push("w25" + b.getParameter(b.VERSION));
            try {
                var C = b.getExtension("WEBGL_debug_renderer_info");
                C &&
                (c.push("wuv:" + b.getParameter(C.UNMASKED_VENDOR_WEBGL)),
                    c.push("wur:" + b.getParameter(C.UNMASKED_RENDERER_WEBGL)));
            } catch (D) {}
            return c.join("\u00a7");
        },
        isCanvasSupported: function () {
            return true;
            var a = document.createElement("canvas");
            return !(!a.getContext || !a.getContext("2d"));
        },
        isIE: function () {
            return "Microsoft Internet Explorer" === navigator.appName ||
            ("Netscape" === navigator.appName &&
                /Trident/.test(navigator.userAgent))
                ? !0
                : !1;
        },
        getWebglCanvas: function () {
            return null;
            var a = document.createElement("canvas"),
                b = null;
            try {
                var c = navigator.userAgent;
                c = c.toLowerCase();
                ((0 < c.indexOf("jdjr-app") || 0 <= c.indexOf("jdapp")) &&
                    (0 < c.indexOf("iphone") || 0 < c.indexOf("ipad"))) ||
                (b = a.getContext("webgl") || a.getContext("experimental-webgl"));
            } catch (l) {}
            b || (b = null);
            return b;
        },
        each: function (a, b, c) {
            if (null !== a)
                if (this.nativeForEach && a.forEach === this.nativeForEach)
                    a.forEach(b, c);
                else if (a.length === +a.length)
                    for (
                        var l = 0, h = a.length;
                        l < h && b.call(c, a[l], l, a) !== {};
                        l++
                    );
                else
                    for (l in a)
                        if (a.hasOwnProperty(l) && b.call(c, a[l], l, a) === {}) break;
        },
        map: function (a, b, c) {
            var l = [];
            if (null == a) return l;
            if (this.nativeMap && a.map === this.nativeMap) return a.map(b, c);
            this.each(a, function (h, q, z) {
                l[l.length] = b.call(c, h, q, z);
            });
            return l;
        },
        x64Add: function (a, b) {
            a = [a[0] >>> 16, a[0] & 65535, a[1] >>> 16, a[1] & 65535];
            b = [b[0] >>> 16, b[0] & 65535, b[1] >>> 16, b[1] & 65535];
            var c = [0, 0, 0, 0];
            c[3] += a[3] + b[3];
            c[2] += c[3] >>> 16;
            c[3] &= 65535;
            c[2] += a[2] + b[2];
            c[1] += c[2] >>> 16;
            c[2] &= 65535;
            c[1] += a[1] + b[1];
            c[0] += c[1] >>> 16;
            c[1] &= 65535;
            c[0] += a[0] + b[0];
            c[0] &= 65535;
            return [(c[0] << 16) | c[1], (c[2] << 16) | c[3]];
        },
        x64Multiply: function (a, b) {
            a = [a[0] >>> 16, a[0] & 65535, a[1] >>> 16, a[1] & 65535];
            b = [b[0] >>> 16, b[0] & 65535, b[1] >>> 16, b[1] & 65535];
            var c = [0, 0, 0, 0];
            c[3] += a[3] * b[3];
            c[2] += c[3] >>> 16;
            c[3] &= 65535;
            c[2] += a[2] * b[3];
            c[1] += c[2] >>> 16;
            c[2] &= 65535;
            c[2] += a[3] * b[2];
            c[1] += c[2] >>> 16;
            c[2] &= 65535;
            c[1] += a[1] * b[3];
            c[0] += c[1] >>> 16;
            c[1] &= 65535;
            c[1] += a[2] * b[2];
            c[0] += c[1] >>> 16;
            c[1] &= 65535;
            c[1] += a[3] * b[1];
            c[0] += c[1] >>> 16;
            c[1] &= 65535;
            c[0] += a[0] * b[3] + a[1] * b[2] + a[2] * b[1] + a[3] * b[0];
            c[0] &= 65535;
            return [(c[0] << 16) | c[1], (c[2] << 16) | c[3]];
        },
        x64Rotl: function (a, b) {
            b %= 64;
            if (32 === b) return [a[1], a[0]];
            if (32 > b)
                return [
                    (a[0] << b) | (a[1] >>> (32 - b)),
                    (a[1] << b) | (a[0] >>> (32 - b)),
                ];
            b -= 32;
            return [
                (a[1] << b) | (a[0] >>> (32 - b)),
                (a[0] << b) | (a[1] >>> (32 - b)),
            ];
        },
        x64LeftShift: function (a, b) {
            b %= 64;
            return 0 === b
                ? a
                : 32 > b
                    ? [(a[0] << b) | (a[1] >>> (32 - b)), a[1] << b]
                    : [a[1] << (b - 32), 0];
        },
        x64Xor: function (a, b) {
            return [a[0] ^ b[0], a[1] ^ b[1]];
        },
        x64Fmix: function (a) {
            a = this.x64Xor(a, [0, a[0] >>> 1]);
            a = this.x64Multiply(a, [4283543511, 3981806797]);
            a = this.x64Xor(a, [0, a[0] >>> 1]);
            a = this.x64Multiply(a, [3301882366, 444984403]);
            return (a = this.x64Xor(a, [0, a[0] >>> 1]));
        },
        x64hash128: function (a, b) {
            a = a || "";
            b = b || 0;
            var c = a.length % 16,
                l = a.length - c,
                h = [0, b];
            b = [0, b];
            for (
                var q,
                    z,
                    C = [2277735313, 289559509],
                    D = [1291169091, 658871167],
                    B = 0;
                B < l;
                B += 16
            )
                (q = [
                    (a.charCodeAt(B + 4) & 255) |
                    ((a.charCodeAt(B + 5) & 255) << 8) |
                    ((a.charCodeAt(B + 6) & 255) << 16) |
                    ((a.charCodeAt(B + 7) & 255) << 24),
                    (a.charCodeAt(B) & 255) |
                    ((a.charCodeAt(B + 1) & 255) << 8) |
                    ((a.charCodeAt(B + 2) & 255) << 16) |
                    ((a.charCodeAt(B + 3) & 255) << 24),
                ]),
                    (z = [
                        (a.charCodeAt(B + 12) & 255) |
                        ((a.charCodeAt(B + 13) & 255) << 8) |
                        ((a.charCodeAt(B + 14) & 255) << 16) |
                        ((a.charCodeAt(B + 15) & 255) << 24),
                        (a.charCodeAt(B + 8) & 255) |
                        ((a.charCodeAt(B + 9) & 255) << 8) |
                        ((a.charCodeAt(B + 10) & 255) << 16) |
                        ((a.charCodeAt(B + 11) & 255) << 24),
                    ]),
                    (q = this.x64Multiply(q, C)),
                    (q = this.x64Rotl(q, 31)),
                    (q = this.x64Multiply(q, D)),
                    (h = this.x64Xor(h, q)),
                    (h = this.x64Rotl(h, 27)),
                    (h = this.x64Add(h, b)),
                    (h = this.x64Add(this.x64Multiply(h, [0, 5]), [0, 1390208809])),
                    (z = this.x64Multiply(z, D)),
                    (z = this.x64Rotl(z, 33)),
                    (z = this.x64Multiply(z, C)),
                    (b = this.x64Xor(b, z)),
                    (b = this.x64Rotl(b, 31)),
                    (b = this.x64Add(b, h)),
                    (b = this.x64Add(this.x64Multiply(b, [0, 5]), [0, 944331445]));
            q = [0, 0];
            z = [0, 0];
            switch (c) {
                case 15:
                    z = this.x64Xor(z, this.x64LeftShift([0, a.charCodeAt(B + 14)], 48));
                case 14:
                    z = this.x64Xor(z, this.x64LeftShift([0, a.charCodeAt(B + 13)], 40));
                case 13:
                    z = this.x64Xor(z, this.x64LeftShift([0, a.charCodeAt(B + 12)], 32));
                case 12:
                    z = this.x64Xor(z, this.x64LeftShift([0, a.charCodeAt(B + 11)], 24));
                case 11:
                    z = this.x64Xor(z, this.x64LeftShift([0, a.charCodeAt(B + 10)], 16));
                case 10:
                    z = this.x64Xor(z, this.x64LeftShift([0, a.charCodeAt(B + 9)], 8));
                case 9:
                    (z = this.x64Xor(z, [0, a.charCodeAt(B + 8)])),
                        (z = this.x64Multiply(z, D)),
                        (z = this.x64Rotl(z, 33)),
                        (z = this.x64Multiply(z, C)),
                        (b = this.x64Xor(b, z));
                case 8:
                    q = this.x64Xor(q, this.x64LeftShift([0, a.charCodeAt(B + 7)], 56));
                case 7:
                    q = this.x64Xor(q, this.x64LeftShift([0, a.charCodeAt(B + 6)], 48));
                case 6:
                    q = this.x64Xor(q, this.x64LeftShift([0, a.charCodeAt(B + 5)], 40));
                case 5:
                    q = this.x64Xor(q, this.x64LeftShift([0, a.charCodeAt(B + 4)], 32));
                case 4:
                    q = this.x64Xor(q, this.x64LeftShift([0, a.charCodeAt(B + 3)], 24));
                case 3:
                    q = this.x64Xor(q, this.x64LeftShift([0, a.charCodeAt(B + 2)], 16));
                case 2:
                    q = this.x64Xor(q, this.x64LeftShift([0, a.charCodeAt(B + 1)], 8));
                case 1:
                    (q = this.x64Xor(q, [0, a.charCodeAt(B)])),
                        (q = this.x64Multiply(q, C)),
                        (q = this.x64Rotl(q, 31)),
                        (q = this.x64Multiply(q, D)),
                        (h = this.x64Xor(h, q));
            }
            h = this.x64Xor(h, [0, a.length]);
            b = this.x64Xor(b, [0, a.length]);
            h = this.x64Add(h, b);
            b = this.x64Add(b, h);
            h = this.x64Fmix(h);
            b = this.x64Fmix(b);
            h = this.x64Add(h, b);
            b = this.x64Add(b, h);
            return (
                ("00000000" + (h[0] >>> 0).toString(16)).slice(-8) +
                ("00000000" + (h[1] >>> 0).toString(16)).slice(-8) +
                ("00000000" + (b[0] >>> 0).toString(16)).slice(-8) +
                ("00000000" + (b[1] >>> 0).toString(16)).slice(-8)
            );
        },
    };
}

var JDDSecCryptoJS =
    JDDSecCryptoJS ||
    (function (t, u) {
        var v = {},
            x = (v.lib = {}),
            w = (x.Base = (function () {
                function g() {}

                return {
                    extend: function (m) {
                        g.prototype = this;
                        var a = new g();
                        m && a.mixIn(m);
                        a.hasOwnProperty("init") ||
                        (a.init = function () {
                            a.$super.init.apply(this, arguments);
                        });
                        a.init.prototype = a;
                        a.$super = this;
                        return a;
                    },
                    create: function () {
                        var m = this.extend();
                        m.init.apply(m, arguments);
                        return m;
                    },
                    init: function () {},
                    mixIn: function (m) {
                        for (var a in m) m.hasOwnProperty(a) && (this[a] = m[a]);
                        m.hasOwnProperty("toString") && (this.toString = m.toString);
                    },
                    clone: function () {
                        return this.init.prototype.extend(this);
                    },
                };
            })()),
            A = (x.WordArray = w.extend({
                init: function (g, m) {
                    g = this.words = g || [];
                    this.sigBytes = m != u ? m : 4 * g.length;
                },
                toString: function (g) {
                    return (g || n).stringify(this);
                },
                concat: function (g) {
                    var m = this.words,
                        a = g.words,
                        b = this.sigBytes;
                    g = g.sigBytes;
                    this.clamp();
                    if (b % 4)
                        for (var c = 0; c < g; c++)
                            m[(b + c) >>> 2] |=
                                ((a[c >>> 2] >>> (24 - (c % 4) * 8)) & 255) <<
                                (24 - ((b + c) % 4) * 8);
                    else if (65535 < a.length)
                        for (c = 0; c < g; c += 4) m[(b + c) >>> 2] = a[c >>> 2];
                    else m.push.apply(m, a);
                    this.sigBytes += g;
                    return this;
                },
                clamp: function () {
                    var g = this.words,
                        m = this.sigBytes;
                    g[m >>> 2] &= 4294967295 << (32 - (m % 4) * 8);
                    g.length = t.ceil(m / 4);
                },
                clone: function () {
                    var g = w.clone.call(this);
                    g.words = this.words.slice(0);
                    return g;
                },
                random: function (g) {
                    for (var m = [], a = 0; a < g; a += 4)
                        m.push((4294967296 * t.random()) | 0);
                    return new A.init(m, g);
                },
            }));
        x.UUID = w.extend({
            generateUuid: function () {
                for (
                    var g = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split(""),
                        m = 0,
                        a = g.length;
                    m < a;
                    m++
                )
                    switch (g[m]) {
                        case "x":
                            g[m] = t.floor(16 * t.random()).toString(16);
                            break;
                        case "y":
                            g[m] = (t.floor(4 * t.random()) + 8).toString(16);
                    }
                return g.join("");
            },
        });
        var y = (v.enc = {}),
            n = (y.Hex = {
                stringify: function (g) {
                    var m = g.words;
                    g = g.sigBytes;
                    var a = [];
                    for (var b = 0; b < g; b++) {
                        var c = (m[b >>> 2] >>> (24 - (b % 4) * 8)) & 255;
                        a.push((c >>> 4).toString(16));
                        a.push((c & 15).toString(16));
                    }
                    return a.join("");
                },
                parse: function (g) {
                    for (var m = g.length, a = [], b = 0; b < m; b += 2)
                        a[b >>> 3] |= parseInt(g.substr(b, 2), 16) << (24 - (b % 8) * 4);
                    return new A.init(a, m / 2);
                },
            }),
            e = (y.Latin1 = {
                stringify: function (g) {
                    var m = g.words;
                    g = g.sigBytes;
                    for (var a = [], b = 0; b < g; b++)
                        a.push(
                            String.fromCharCode((m[b >>> 2] >>> (24 - (b % 4) * 8)) & 255)
                        );
                    return a.join("");
                },
                parse: function (g) {
                    for (var m = g.length, a = [], b = 0; b < m; b++)
                        a[b >>> 2] |= (g.charCodeAt(b) & 255) << (24 - (b % 4) * 8);
                    return new A.init(a, m);
                },
            }),
            f = (y.Utf8 = {
                stringify: function (g) {
                    try {
                        return decodeURIComponent(escape(e.stringify(g)));
                    } catch (m) {
                        throw Error("Malformed UTF-8 data");
                    }
                },
                parse: function (g) {
                    return e.parse(unescape(encodeURIComponent(g)));
                },
            }),
            r = (x.BufferedBlockAlgorithm = w.extend({
                reset: function () {
                    this._data = new A.init();
                    this._nDataBytes = 0;
                },
                _append: function (g) {
                    "string" == typeof g && (g = f.parse(g));
                    this._data.concat(g);
                    this._nDataBytes += g.sigBytes;
                },
                _process: function (g) {
                    var m = this._data,
                        a = m.words,
                        b = m.sigBytes,
                        c = this.blockSize,
                        l = b / (4 * c);
                    l = g ? t.ceil(l) : t.max((l | 0) - this._minBufferSize, 0);
                    g = l * c;
                    b = t.min(4 * g, b);
                    if (g) {
                        for (var h = 0; h < g; h += c) this._doProcessBlock(a, h);
                        h = a.splice(0, g);
                        m.sigBytes -= b;
                    }
                    return new A.init(h, b);
                },
                clone: function () {
                    var g = w.clone.call(this);
                    g._data = this._data.clone();
                    return g;
                },
                _minBufferSize: 0,
            }));
        x.Hasher = r.extend({
            cfg: w.extend(),
            init: function (g) {
                this.cfg = this.cfg.extend(g);
                this.reset();
            },
            reset: function () {
                r.reset.call(this);
                this._doReset();
            },
            update: function (g) {
                this._append(g);
                this._process();
                return this;
            },
            finalize: function (g) {
                g && this._append(g);
                return this._doFinalize();
            },
            blockSize: 16,
            _createHelper: function (g) {
                return function (m, a) {
                    return new g.init(a).finalize(m);
                };
            },
            _createHmacHelper: function (g) {
                return function (m, a) {
                    return new k.HMAC.init(g, a).finalize(m);
                };
            },
        });
        var k = (v.algo = {});
        v.channel = {};
        return v;
    })(Math);
JDDSecCryptoJS.lib.Cipher ||
(function (t) {
    var u = JDDSecCryptoJS,
        v = u.lib,
        x = v.Base,
        w = v.WordArray,
        A = v.BufferedBlockAlgorithm,
        y = (v.Cipher = A.extend({
            cfg: x.extend(),
            createEncryptor: function (g, m) {
                return this.create(this._ENC_XFORM_MODE, g, m);
            },
            createDecryptor: function (g, m) {
                return this.create(this._DEC_XFORM_MODE, g, m);
            },
            init: function (g, m, a) {
                this.cfg = this.cfg.extend(a);
                this._xformMode = g;
                this._key = m;
                this.reset();
            },
            reset: function () {
                A.reset.call(this);
                this._doReset();
            },
            process: function (g) {
                this._append(g);
                return this._process();
            },
            finalize: function (g) {
                g && this._append(g);
                return this._doFinalize();
            },
            keySize: 4,
            ivSize: 4,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            _createHelper: (function () {
                function g(m) {
                    if ("string" != typeof m) return k;
                }

                return function (m) {
                    return {
                        encrypt: function (a, b, c) {
                            return g(b).encrypt(m, a, b, c);
                        },
                        decrypt: function (a, b, c) {
                            return g(b).decrypt(m, a, b, c);
                        },
                    };
                };
            })(),
        }));
    v.StreamCipher = y.extend({
        _doFinalize: function () {
            return this._process(!0);
        },
        blockSize: 1,
    });
    var n = (u.mode = {}),
        e = (v.BlockCipherMode = x.extend({
            createEncryptor: function (g, m) {
                return this.Encryptor.create(g, m);
            },
            createDecryptor: function (g, m) {
                return this.Decryptor.create(g, m);
            },
            init: function (g, m) {
                this._cipher = g;
                this._iv = m;
            },
        }));
    n = n.CBC = (function () {
        function g(a, b, c) {
            var l = this._iv;
            l ? (this._iv = t) : (l = this._prevBlock);
            for (var h = 0; h < c; h++) a[b + h] ^= l[h];
        }

        var m = e.extend();
        m.Encryptor = m.extend({
            processBlock: function (a, b) {
                var c = this._cipher,
                    l = c.blockSize;
                g.call(this, a, b, l);
                c.encryptBlock(a, b);
                this._prevBlock = a.slice(b, b + l);
            },
        });
        m.Decryptor = m.extend({
            processBlock: function (a, b) {
                var c = this._cipher,
                    l = c.blockSize,
                    h = a.slice(b, b + l);
                c.decryptBlock(a, b);
                g.call(this, a, b, l);
                this._prevBlock = h;
            },
        });
        return m;
    })();
    var f = ((u.pad = {}).Pkcs7 = {
        pad: function (g, m) {
            m *= 4;
            m -= g.sigBytes % m;
            for (
                var a = (m << 24) | (m << 16) | (m << 8) | m, b = [], c = 0;
                c < m;
                c += 4
            )
                b.push(a);
            m = w.create(b, m);
            g.concat(m);
        },
        unpad: function (g) {
            g.sigBytes -= g.words[(g.sigBytes - 1) >>> 2] & 255;
        },
    });
    v.BlockCipher = y.extend({
        cfg: y.cfg.extend({
            mode: n,
            padding: f,
        }),
        reset: function () {
            y.reset.call(this);
            var g = this.cfg,
                m = g.iv;
            g = g.mode;
            if (this._xformMode == this._ENC_XFORM_MODE) var a = g.createEncryptor;
            else (a = g.createDecryptor), (this._minBufferSize = 1);
            this._mode = a.call(g, this, m && m.words);
        },
        _doProcessBlock: function (g, m) {
            this._mode.processBlock(g, m);
        },
        _doFinalize: function () {
            var g = this.cfg.padding;
            if (this._xformMode == this._ENC_XFORM_MODE) {
                g.pad(this._data, this.blockSize);
                var m = this._process(!0);
            } else (m = this._process(!0)), g.unpad(m);
            return m;
        },
        blockSize: 4,
    });
    var r = (v.CipherParams = x.extend({
        init: function (g) {
            this.mixIn(g);
        },
        toString: function (g) {
            return (g || this.formatter).stringify(this);
        },
    }));
    u.format = {};
    var k = (v.SerializableCipher = x.extend({
        cfg: x.extend({}),
        encrypt: function (g, m, a, b) {
            b = this.cfg.extend(b);
            var c = g.createEncryptor(a, b);
            m = c.finalize(m);
            c = c.cfg;
            return r.create({
                ciphertext: m,
                key: a,
                iv: c.iv,
                algorithm: g,
                mode: c.mode,
                padding: c.padding,
                blockSize: g.blockSize,
                formatter: b.format,
            });
        },
        decrypt: function (g, m, a, b) {
            b = this.cfg.extend(b);
            m = this._parse(m, b.format);
            return g.createDecryptor(a, b).finalize(m.ciphertext);
        },
        _parse: function (g, m) {
            return "string" == typeof g ? m.parse(g, this) : g;
        },
    }));
})();
(function () {
    var t = JDDSecCryptoJS,
        u = t.lib.BlockCipher,
        v = t.algo,
        x = [],
        w = [],
        A = [],
        y = [],
        n = [],
        e = [],
        f = [],
        r = [],
        k = [],
        g = [];
    (function () {
        for (var a = [], b = 0; 256 > b; b++)
            a[b] = 128 > b ? b << 1 : (b << 1) ^ 283;
        var c = 0,
            l = 0;
        for (b = 0; 256 > b; b++) {
            var h = l ^ (l << 1) ^ (l << 2) ^ (l << 3) ^ (l << 4);
            h = (h >>> 8) ^ (h & 255) ^ 99;
            x[c] = h;
            w[h] = c;
            var q = a[c],
                z = a[q],
                C = a[z],
                D = (257 * a[h]) ^ (16843008 * h);
            A[c] = (D << 24) | (D >>> 8);
            y[c] = (D << 16) | (D >>> 16);
            n[c] = (D << 8) | (D >>> 24);
            e[c] = D;
            D = (16843009 * C) ^ (65537 * z) ^ (257 * q) ^ (16843008 * c);
            f[h] = (D << 24) | (D >>> 8);
            r[h] = (D << 16) | (D >>> 16);
            k[h] = (D << 8) | (D >>> 24);
            g[h] = D;
            c ? ((c = q ^ a[a[a[C ^ q]]]), (l ^= a[a[l]])) : (c = l = 1);
        }
    })();
    var m = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
    v = v.AES = u.extend({
        _doReset: function () {
            var a = this._key,
                b = a.words,
                c = a.sigBytes / 4;
            a = 4 * ((this._nRounds = c + 6) + 1);
            for (var l = (this._keySchedule = []), h = 0; h < a; h++)
                if (h < c) l[h] = b[h];
                else {
                    var q = l[h - 1];
                    h % c
                        ? 6 < c &&
                        4 == h % c &&
                        (q =
                            (x[q >>> 24] << 24) |
                            (x[(q >>> 16) & 255] << 16) |
                            (x[(q >>> 8) & 255] << 8) |
                            x[q & 255])
                        : ((q = (q << 8) | (q >>> 24)),
                            (q =
                                (x[q >>> 24] << 24) |
                                (x[(q >>> 16) & 255] << 16) |
                                (x[(q >>> 8) & 255] << 8) |
                                x[q & 255]),
                            (q ^= m[(h / c) | 0] << 24));
                    l[h] = l[h - c] ^ q;
                }
            b = this._invKeySchedule = [];
            for (c = 0; c < a; c++)
                (h = a - c),
                    (q = c % 4 ? l[h] : l[h - 4]),
                    (b[c] =
                        4 > c || 4 >= h
                            ? q
                            : f[x[q >>> 24]] ^
                            r[x[(q >>> 16) & 255]] ^
                            k[x[(q >>> 8) & 255]] ^
                            g[x[q & 255]]);
        },
        encryptBlock: function (a, b) {
            this._doCryptBlock(a, b, this._keySchedule, A, y, n, e, x);
        },
        decryptBlock: function (a, b) {
            var c = a[b + 1];
            a[b + 1] = a[b + 3];
            a[b + 3] = c;
            this._doCryptBlock(a, b, this._invKeySchedule, f, r, k, g, w);
            c = a[b + 1];
            a[b + 1] = a[b + 3];
            a[b + 3] = c;
        },
        _doCryptBlock: function (a, b, c, l, h, q, z, C) {
            for (
                var D = this._nRounds,
                    B = a[b] ^ c[0],
                    F = a[b + 1] ^ c[1],
                    H = a[b + 2] ^ c[2],
                    G = a[b + 3] ^ c[3],
                    I = 4,
                    M = 1;
                M < D;
                M++
            ) {
                var J =
                    l[B >>> 24] ^
                    h[(F >>> 16) & 255] ^
                    q[(H >>> 8) & 255] ^
                    z[G & 255] ^
                    c[I++],
                    K =
                        l[F >>> 24] ^
                        h[(H >>> 16) & 255] ^
                        q[(G >>> 8) & 255] ^
                        z[B & 255] ^
                        c[I++],
                    L =
                        l[H >>> 24] ^
                        h[(G >>> 16) & 255] ^
                        q[(B >>> 8) & 255] ^
                        z[F & 255] ^
                        c[I++];
                G =
                    l[G >>> 24] ^
                    h[(B >>> 16) & 255] ^
                    q[(F >>> 8) & 255] ^
                    z[H & 255] ^
                    c[I++];
                B = J;
                F = K;
                H = L;
            }
            J =
                ((C[B >>> 24] << 24) |
                    (C[(F >>> 16) & 255] << 16) |
                    (C[(H >>> 8) & 255] << 8) |
                    C[G & 255]) ^
                c[I++];
            K =
                ((C[F >>> 24] << 24) |
                    (C[(H >>> 16) & 255] << 16) |
                    (C[(G >>> 8) & 255] << 8) |
                    C[B & 255]) ^
                c[I++];
            L =
                ((C[H >>> 24] << 24) |
                    (C[(G >>> 16) & 255] << 16) |
                    (C[(B >>> 8) & 255] << 8) |
                    C[F & 255]) ^
                c[I++];
            G =
                ((C[G >>> 24] << 24) |
                    (C[(B >>> 16) & 255] << 16) |
                    (C[(F >>> 8) & 255] << 8) |
                    C[H & 255]) ^
                c[I++];
            a[b] = J;
            a[b + 1] = K;
            a[b + 2] = L;
            a[b + 3] = G;
        },
        keySize: 8,
    });
    t.AES = u._createHelper(v);
})();

(function () {
    var t = JDDSecCryptoJS,
        u = t.lib,
        v = u.WordArray,
        x = u.Hasher,
        w = [];
    u = t.algo.SHA1 = x.extend({
        _doReset: function () {
            this._hash = new v.init([
                1732584193, 4023233417, 2562383102, 271733878, 3285377520,
            ]);
        },
        _doProcessBlock: function (A, y) {
            for (
                var n = this._hash.words,
                    e = n[0],
                    f = n[1],
                    r = n[2],
                    k = n[3],
                    g = n[4],
                    m = 0;
                80 > m;
                m++
            ) {
                if (16 > m) w[m] = A[y + m] | 0;
                else {
                    var a = w[m - 3] ^ w[m - 8] ^ w[m - 14] ^ w[m - 16];
                    w[m] = (a << 1) | (a >>> 31);
                }
                a = ((e << 5) | (e >>> 27)) + g + w[m];
                a =
                    20 > m
                        ? a + (((f & r) | (~f & k)) + 1518500249)
                        : 40 > m
                        ? a + ((f ^ r ^ k) + 1859775393)
                        : 60 > m
                            ? a + (((f & r) | (f & k) | (r & k)) - 1894007588)
                            : a + ((f ^ r ^ k) - 899497514);
                g = k;
                k = r;
                r = (f << 30) | (f >>> 2);
                f = e;
                e = a;
            }
            n[0] = (n[0] + e) | 0;
            n[1] = (n[1] + f) | 0;
            n[2] = (n[2] + r) | 0;
            n[3] = (n[3] + k) | 0;
            n[4] = (n[4] + g) | 0;
        },
        _doFinalize: function () {
            var A = this._data,
                y = A.words,
                n = 8 * this._nDataBytes,
                e = 8 * A.sigBytes;
            y[e >>> 5] |= 128 << (24 - (e % 32));
            y[(((e + 64) >>> 9) << 4) + 14] = Math.floor(n / 4294967296);
            y[(((e + 64) >>> 9) << 4) + 15] = n;
            A.sigBytes = 4 * y.length;
            this._process();
            return this._hash;
        },
        clone: function () {
            var A = x.clone.call(this);
            A._hash = this._hash.clone();
            return A;
        },
    });
    t.SHA1 = x._createHelper(u);
    t.HmacSHA1 = x._createHmacHelper(u);
})();

(function () {
    var t = JDDSecCryptoJS,
        u = t.channel;
    u.Downlink = {
        deBase32: function (v) {
            if (void 0 == v || "" == v || null == v) return "";
            var x = t.enc.Hex.parse("30313233343536373839616263646566"),
                w = t.enc.Hex.parse("724e5428476f307361374d3233784a6c");
            return t.AES.decrypt(
                {
                    ciphertext: t.enc.Base32.parse(v),
                },
                w,
                {
                    mode: t.mode.CBC,
                    padding: t.pad.Pkcs7,
                    iv: x,
                }
            ).toString(t.enc.Utf8);
        },
        deBase64: function (v) {
            return "";
        },
    };
    u.Uplink = {
        enAsBase32: function (v) {
            return "";
        },
        enAsBase64: function (v) {
            return "";
        },
    };
})();

(function () {
    var t = JDDSecCryptoJS,
        u = t.lib.WordArray;
    t.enc.Base32 = {
        stringify: function (v) {
            var x = v.words,
                w = v.sigBytes,
                A = this._map;
            v.clamp();
            v = [];
            for (var y = 0; y < w; y += 5) {
                for (var n = [], e = 0; 5 > e; e++)
                    n[e] = (x[(y + e) >>> 2] >>> (24 - ((y + e) % 4) * 8)) & 255;
                n = [
                    (n[0] >>> 3) & 31,
                    ((n[0] & 7) << 2) | ((n[1] >>> 6) & 3),
                    (n[1] >>> 1) & 31,
                    ((n[1] & 1) << 4) | ((n[2] >>> 4) & 15),
                    ((n[2] & 15) << 1) | ((n[3] >>> 7) & 1),
                    (n[3] >>> 2) & 31,
                    ((n[3] & 3) << 3) | ((n[4] >>> 5) & 7),
                    n[4] & 31,
                ];
                for (e = 0; 8 > e && y + 0.625 * e < w; e++) v.push(A.charAt(n[e]));
            }
            if ((x = A.charAt(32))) for (; v.length % 8; ) v.push(x);
            return v.join("");
        },
        parse: function (v) {
            var x = v.length,
                w = this._map,
                A = w.charAt(32);
            A && ((A = v.indexOf(A)), -1 != A && (x = A));
            A = [];
            for (var y = 0, n = 0; n < x; n++) {
                var e = n % 8;
                if (0 != e && 2 != e && 5 != e) {
                    var f = 255 & (w.indexOf(v.charAt(n - 1)) << (40 - 5 * e) % 8),
                        r = 255 & (w.indexOf(v.charAt(n)) >>> (5 * e - 3) % 8);
                    e =
                        e % 3 ? 0 : 255 & (w.indexOf(v.charAt(n - 2)) << (3 == e ? 6 : 7));
                    A[y >>> 2] |= (f | r | e) << (24 - (y % 4) * 8);
                    y++;
                }
            }
            return u.create(A, y);
        },
        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
    };
})();

class JDDMAC {
    static t() {
        return "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D"
            .split(" ")
            .map(function (v) {
                return parseInt(v, 16);
            });
    }

    mac(v) {
        for (var x = -1, w = 0, A = v.length; w < A; w++)
            x = (x >>> 8) ^ t[(x ^ v.charCodeAt(w)) & 255];
        return (x ^ -1) >>> 0;
    }
}

var _CurrentPageProtocol =
        "https:" == document.location.protocol ? "https://" : "http://",
    _JdJrTdRiskDomainName = window.__fp_domain || "gia.jd.com",
    _url_query_str = "",
    _root_domain = "",
    _CurrentPageUrl = (function () {
        var t = document.location.href.toString();
        try {
            _root_domain =
                /^https?:\/\/(?:\w+\.)*?(\w*\.(?:com\.cn|cn|com|net|id))[\\\/]*/.exec(
                    t
                )[1];
        } catch (v) {}
        var u = t.indexOf("?");
        0 < u &&
        ((_url_query_str = t.substring(u + 1)),
        500 < _url_query_str.length &&
        (_url_query_str = _url_query_str.substring(0, 499)),
            (t = t.substring(0, u)));
        return (t = t.substring(_CurrentPageProtocol.length));
    })(),
    jd_shadow__ = (function () {
        try {
            var t = JDDSecCryptoJS,
                u = [];
            u.push(_CurrentPageUrl);
            var v = t.lib.UUID.generateUuid();
            u.push(v);
            var x = new Date().getTime();
            u.push(x);
            var w = t.SHA1(u.join("")).toString().toUpperCase();
            u = [];
            u.push("JD3");
            u.push(w);
            var A = new JDDMAC().mac(u.join(""));
            u.push(A);
            var y = t.enc.Hex.parse("30313233343536373839616263646566"),
                n = t.enc.Hex.parse("4c5751554935255042304e6458323365"),
                e = u.join("");
            return t.AES.encrypt(t.enc.Utf8.parse(e), n, {
                mode: t.mode.CBC,
                padding: t.pad.Pkcs7,
                iv: y,
            }).ciphertext.toString(t.enc.Base32);
        } catch (f) {
            console.log(f);
        }
    })();
var td_collect = new (function () {
    function t() {
        var n =
            window.webkitRTCPeerConnection ||
            window.mozRTCPeerConnection ||
            window.RTCPeerConnection;
        if (n) {
            var e = function (k) {
                    var g = /([0-9]{1,3}(\.[0-9]{1,3}){3})/,
                        m =
                            /\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*/;
                    try {
                        var a = g.exec(k);
                        if (null == a || 0 == a.length || void 0 == a) a = m.exec(k);
                        var b = a[1];
                        void 0 === f[b] && w.push(b);
                        f[b] = !0;
                    } catch (c) {}
                },
                f = {};
            try {
                var r = new n({
                    iceServers: [
                        {
                            url: "stun:stun.services.mozilla.com",
                        },
                    ],
                });
            } catch (k) {}
            try {
                void 0 === r &&
                (r = new n({
                    iceServers: [],
                }));
            } catch (k) {}
            if (r || window.mozRTCPeerConnection)
                try {
                    r.createDataChannel("chat", {
                        reliable: !1,
                    });
                } catch (k) {}
            r &&
            ((r.onicecandidate = function (k) {
                k.candidate && e(k.candidate.candidate);
            }),
                r.createOffer(
                    function (k) {
                        r.setLocalDescription(
                            k,
                            function () {},
                            function () {}
                        );
                    },
                    function () {}
                ),
                setTimeout(function () {
                    try {
                        r.localDescription.sdp.split("\n").forEach(function (k) {
                            0 === k.indexOf("a=candidate:") && e(k);
                        });
                    } catch (k) {}
                }, 800));
        }
    }

    function u(n) {
        var e;
        return (e = document.cookie.match(
            new RegExp("(^| )" + n + "=([^;]*)(;|$)")
        ))
            ? e[2]
            : "";
    }

    function v() {
        function n(g) {
            var m = {};
            r.style.fontFamily = g;
            document.body.appendChild(r);
            m.height = r.offsetHeight;
            m.width = r.offsetWidth;
            document.body.removeChild(r);
            return m;
        }

        var e = ["monospace", "sans-serif", "serif"],
            f = [],
            r = document.createElement("span");
        r.style.fontSize = "72px";
        r.style.visibility = "hidden";
        r.innerHTML = "mmmmmmmmmmlli";
        for (var k = 0; k < e.length; k++) f[k] = n(e[k]);
        this.checkSupportFont = function (g) {
            for (var m = 0; m < f.length; m++) {
                var a = n(g + "," + e[m]),
                    b = f[m];
                if (a.height !== b.height || a.width !== b.width) return !0;
            }
            return !1;
        };
    }

    function x(n) {
        var e = {};
        e.name = n.name;
        e.filename = n.filename.toLowerCase();
        e.description = n.description;
        void 0 !== n.version && (e.version = n.version);
        e.mimeTypes = [];
        for (var f = 0; f < n.length; f++) {
            var r = n[f],
                k = {};
            k.description = r.description;
            k.suffixes = r.suffixes;
            k.type = r.type;
            e.mimeTypes.push(k);
        }
        return e;
    }

    this.bizId = "";
    this.bioConfig = {
        type: "42",
        operation: 1,
        duraTime: 2,
        interval: 50,
    };
    this.worder = null;
    this.deviceInfo = {
        userAgent: "",
        isJdApp: !1,
        isJrApp: !1,
        sdkToken: "",
        fp: "",
        eid: "",
    };
    this.isRpTok = !1;
    this.obtainLocal = function (n) {
        n = "undefined" !== typeof n && n ? !0 : !1;
        var e = {};
        try {
            var f = document.cookie.replace(
                /(?:(?:^|.*;\s*)3AB9D23F7A4B3C9B\s*=\s*([^;]*).*$)|^.*$/,
                "$1"
            );
            0 !== f.length && (e.cookie = f);
        } catch (k) {}
        try {
            window.localStorage &&
            null !== window.localStorage &&
            0 !== window.localStorage.length &&
            (e.localStorage = window.localStorage.getItem("3AB9D23F7A4B3C9B"));
        } catch (k) {}
        try {
            window.sessionStorage &&
            null !== window.sessionStorage &&
            (e.sessionStorage = window.sessionStorage["3AB9D23F7A4B3C9B"]);
        } catch (k) {}
        try {
            p.globalStorage &&
            (e.globalStorage =
                window.globalStorage[".localdomain"]["3AB9D23F7A4B3C9B"]);
        } catch (k) {}
        try {
            d &&
            "function" == typeof d.load &&
            "function" == typeof d.getAttribute &&
            (d.load("jdgia_user_data"),
                (e.userData = d.getAttribute("3AB9D23F7A4B3C9B")));
        } catch (k) {}
        try {
            E.indexedDbId && (e.indexedDb = E.indexedDbId);
        } catch (k) {}
        try {
            E.webDbId && (e.webDb = E.webDbId);
        } catch (k) {}
        try {
            for (var r in e)
                if (32 < e[r].length) {
                    _JdEid = e[r];
                    n || (_eidFlag = !0);
                    break;
                }
        } catch (k) {}
        try {
            ("undefined" === typeof _JdEid || 0 >= _JdEid.length) &&
            this.db("3AB9D23F7A4B3C9B");
            if ("undefined" === typeof _JdEid || 0 >= _JdEid.length)
                _JdEid = u("3AB9D23F7A4B3C9B");
            if ("undefined" === typeof _JdEid || 0 >= _JdEid.length) _eidFlag = !0;
        } catch (k) {}
        return _JdEid;
    };
    var w = [],
        A =
            "Abadi MT Condensed Light;Adobe Fangsong Std;Adobe Hebrew;Adobe Ming Std;Agency FB;Arab;Arabic Typesetting;Arial Black;Batang;Bauhaus 93;Bell MT;Bitstream Vera Serif;Bodoni MT;Bookman Old Style;Braggadocio;Broadway;Calibri;Californian FB;Castellar;Casual;Centaur;Century Gothic;Chalkduster;Colonna MT;Copperplate Gothic Light;DejaVu LGC Sans Mono;Desdemona;DFKai-SB;Dotum;Engravers MT;Eras Bold ITC;Eurostile;FangSong;Forte;Franklin Gothic Heavy;French Script MT;Gabriola;Gigi;Gisha;Goudy Old Style;Gulim;GungSeo;Haettenschweiler;Harrington;Hiragino Sans GB;Impact;Informal Roman;KacstOne;Kino MT;Kozuka Gothic Pr6N;Lohit Gujarati;Loma;Lucida Bright;Lucida Fax;Magneto;Malgun Gothic;Matura MT Script Capitals;Menlo;MingLiU-ExtB;MoolBoran;MS PMincho;MS Reference Sans Serif;News Gothic MT;Niagara Solid;Nyala;Palace Script MT;Papyrus;Perpetua;Playbill;PMingLiU;Rachana;Rockwell;Sawasdee;Script MT Bold;Segoe Print;Showcard Gothic;SimHei;Snap ITC;TlwgMono;Tw Cen MT Condensed Extra Bold;Ubuntu;Umpush;Univers;Utopia;Vladimir Script;Wide Latin".split(
                ";"
            ),
        y =
            "4game;AdblockPlugin;AdobeExManCCDetect;AdobeExManDetect;Alawar NPAPI utils;Aliedit Plug-In;Alipay Security Control 3;AliSSOLogin plugin;AmazonMP3DownloaderPlugin;AOL Media Playback Plugin;AppUp;ArchiCAD;AVG SiteSafety plugin;Babylon ToolBar;Battlelog Game Launcher;BitCometAgent;Bitdefender QuickScan;BlueStacks Install Detector;CatalinaGroup Update;Citrix ICA Client;Citrix online plug-in;Citrix Receiver Plug-in;Coowon Update;DealPlyLive Update;Default Browser Helper;DivX Browser Plug-In;DivX Plus Web Player;DivX VOD Helper Plug-in;doubleTwist Web Plugin;Downloaders plugin;downloadUpdater;eMusicPlugin DLM6;ESN Launch Mozilla Plugin;ESN Sonar API;Exif Everywhere;Facebook Plugin;File Downloader Plug-in;FileLab plugin;FlyOrDie Games Plugin;Folx 3 Browser Plugin;FUZEShare;GDL Object Web Plug-in 16.00;GFACE Plugin;Ginger;Gnome Shell Integration;Google Earth Plugin;Google Earth Plug-in;Google Gears 0.5.33.0;Google Talk Effects Plugin;Google Update;Harmony Firefox Plugin;Harmony Plug-In;Heroes & Generals live;HPDetect;Html5 location provider;IE Tab plugin;iGetterScriptablePlugin;iMesh plugin;Kaspersky Password Manager;LastPass;LogMeIn Plugin 1.0.0.935;LogMeIn Plugin 1.0.0.961;Ma-Config.com plugin;Microsoft Office 2013;MinibarPlugin;Native Client;Nitro PDF Plug-In;Nokia Suite Enabler Plugin;Norton Identity Safe;npAPI Plugin;NPLastPass;NPPlayerShell;npTongbuAddin;NyxLauncher;Octoshape Streaming Services;Online Storage plug-in;Orbit Downloader;Pando Web Plugin;Parom.TV player plugin;PDF integrado do WebKit;PDF-XChange Viewer;PhotoCenterPlugin1.1.2.2;Picasa;PlayOn Plug-in;QQ2013 Firefox Plugin;QQDownload Plugin;QQMiniDL Plugin;QQMusic;RealDownloader Plugin;Roblox Launcher Plugin;RockMelt Update;Safer Update;SafeSearch;Scripting.Dictionary;SefClient Plugin;Shell.UIHelper;Silverlight Plug-In;Simple Pass;Skype Web Plugin;SumatraPDF Browser Plugin;Symantec PKI Client;Tencent FTN plug-in;Thunder DapCtrl NPAPI Plugin;TorchHelper;Unity Player;Uplay PC;VDownloader;Veetle TV Core;VLC Multimedia Plugin;Web Components;WebKit-integrierte PDF;WEBZEN Browser Extension;Wolfram Mathematica;WordCaptureX;WPI Detector 1.4;Yandex Media Plugin;Yandex PDF Viewer;YouTube Plug-in;zako".split(
                ";"
            );
    this.toJson = "object" === typeof JSON && JSON.stringify;
    this.init = function () {
        _fingerprint_step = 6;
        t();
        _fingerprint_step = 7;
        "function" !== typeof this.toJson &&
        (this.toJson = function (n) {
            var e = typeof n;
            if ("undefined" === e || null === n) return "null";
            if ("number" === e || "boolean" === e) return n + "";
            if ("object" === e && n && n.constructor === Array) {
                e = [];
                for (var f = 0; n.length > f; f++) e.push(this.toJson(n[f]));
                return "[" + (e + "]");
            }
            if ("object" === e) {
                e = [];
                for (f in n)
                    n.hasOwnProperty(f) && e.push('"' + f + '":' + this.toJson(n[f]));
                return "{" + (e + "}");
            }
        });
        this.sdkCollectInit();
    };
    this.sdkCollectInit = function () {
        try {
            try {
                bp_bizid && (this.bizId = bp_bizid);
            } catch (f) {
                this.bizId = "jsDefault";
            }
            var n = navigator.userAgent.toLowerCase(),
                e =
                    !n.match(/(iphone|ipad|ipod)/i) &&
                    (-1 < n.indexOf("android") || -1 < n.indexOf("adr"));
            this.deviceInfo.isJdApp = -1 < n.indexOf("jdapp");
            this.deviceInfo.isJrApp = -1 < n.indexOf("jdjr");
            this.deviceInfo.userAgent = navigator.userAgent;
            this.deviceInfo.isAndroid = e;
            this.createWorker();
        } catch (f) {}
    };
    this.db = function (n, e) {
        try {
            _fingerprint_step = "m";
            if (window.openDatabase) {
                var f = window.openDatabase(
                    "sqlite_jdtdstorage",
                    "",
                    "jdtdstorage",
                    1048576
                );
                void 0 !== e && "" != e
                    ? f.transaction(function (r) {
                        r.executeSql(
                            "CREATE TABLE IF NOT EXISTS cache(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, value TEXT NOT NULL, UNIQUE (name))",
                            [],
                            function (k, g) {},
                            function (k, g) {}
                        );
                        r.executeSql(
                            "INSERT OR REPLACE INTO cache(name, value) VALUES(?, ?)",
                            [n, e],
                            function (k, g) {},
                            function (k, g) {}
                        );
                    })
                    : f.transaction(function (r) {
                        r.executeSql(
                            "SELECT value FROM cache WHERE name=?",
                            [n],
                            function (k, g) {
                                1 <= g.rows.length && (_JdEid = g.rows.item(0).value);
                            },
                            function (k, g) {}
                        );
                    });
            }
            _fingerprint_step = "n";
        } catch (r) {}
    };
    this.setCookie = function (n, e) {
        void 0 !== e &&
        "" != e &&
        (document.cookie =
            n +
            "=" +
            e +
            "; expires=Tue, 31 Dec 2030 00:00:00 UTC; path=/; domain=" +
            _root_domain);
    };
    this.tdencrypt = function (n) {
        n = this.toJson(n);
        n = encodeURIComponent(n);
        var e = "",
            f = 0;
        do {
            var r = n.charCodeAt(f++);
            var k = n.charCodeAt(f++);
            var g = n.charCodeAt(f++);
            var m = r >> 2;
            r = ((r & 3) << 4) | (k >> 4);
            var a = ((k & 15) << 2) | (g >> 6);
            var b = g & 63;
            isNaN(k) ? (a = b = 64) : isNaN(g) && (b = 64);
            e =
                e +
                "23IL<N01c7KvwZO56RSTAfghiFyzWJqVabGH4PQdopUrsCuX*xeBjkltDEmn89.-".charAt(
                    m
                ) +
                "23IL<N01c7KvwZO56RSTAfghiFyzWJqVabGH4PQdopUrsCuX*xeBjkltDEmn89.-".charAt(
                    r
                ) +
                "23IL<N01c7KvwZO56RSTAfghiFyzWJqVabGH4PQdopUrsCuX*xeBjkltDEmn89.-".charAt(
                    a
                ) +
                "23IL<N01c7KvwZO56RSTAfghiFyzWJqVabGH4PQdopUrsCuX*xeBjkltDEmn89.-".charAt(
                    b
                );
        } while (f < n.length);
        return e + "/";
    };
    this.collect = function () {
        var n = new Date();
        try {
            var e = document.createElement("div"),
                f = {},
                r =
                    "ActiveBorder ActiveCaption AppWorkspace Background ButtonFace ButtonHighlight ButtonShadow ButtonText CaptionText GrayText Highlight HighlightText InactiveBorder InactiveCaption InactiveCaptionText InfoBackground InfoText Menu MenuText Scrollbar ThreeDDarkShadow ThreeDFace ThreeDHighlight ThreeDLightShadow ThreeDShadow Window WindowFrame WindowText".split(
                        " "
                    );
            if (window.getComputedStyle)
                for (var k = 0; k < r.length; k++)
                    document.body.appendChild(e),
                        (e.style.color = r[k]),
                        (f[r[k]] = window.getComputedStyle(e).getPropertyValue("color")),
                        document.body.removeChild(e);
        } catch (D) {}
        e = {
            ca: {},
            ts: {},
            m: {},
        };
        r = e.ca;
        r.tdHash = _jdfp_canvas_md5;
        var g = !1;
        if ((k = window.WebGLRenderingContext))
            (k = navigator.userAgent),
                (k = k.toLowerCase()),
                (k =
                    (0 < k.indexOf("jdjr-app") || 0 <= k.indexOf("jdapp")) &&
                    (0 < k.indexOf("iphone") || 0 < k.indexOf("ipad"))
                        ? !0
                        : !1),
                (k = !k);
        if (k) {
            var m = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
                a = [],
                b;
            for (k = 0; k < m.length; k++)
                try {
                    var c = !1;
                    (c = document.createElement("canvas").getContext(m[k], {
                        stencil: !0,
                    })) &&
                    c &&
                    ((b = c), a.push(m[k]));
                } catch (D) {}
            a.length &&
            (g = {
                name: a,
                gl: b,
            });
        }
        if (g) {
            k = g.gl;
            r.contextName = g.name.join();
            r.webglversion = k.getParameter(k.VERSION);
            r.shadingLV = k.getParameter(k.SHADING_LANGUAGE_VERSION);
            r.vendor = k.getParameter(k.VENDOR);
            r.renderer = k.getParameter(k.RENDERER);
            b = [];
            try {
                (b = k.getSupportedExtensions()), (r.extensions = b);
            } catch (D) {}
            try {
                var l = k.getExtension("WEBGL_debug_renderer_info");
                l &&
                ((r.wuv = k.getParameter(l.UNMASKED_VENDOR_WEBGL)),
                    (r.wur = k.getParameter(l.UNMASKED_RENDERER_WEBGL)));
            } catch (D) {}
        }
        e.m.documentMode = document.documentMode;
        e.m.compatMode = document.compatMode;
        l = [];
        // r = new v;
        // for (k = 0; k < A.length; k++) b = A[k], r.checkSupportFont(b) && l.push(b);
        e.fo = l;
        k = {};
        l = [];
        for (var h in navigator)
            "object" != typeof navigator[h] && (k[h] = navigator[h]), l.push(h);
        k.enumerationOrder = l;
        k.javaEnabled = false;
        try {
            k.taintEnabled = navigator.taintEnabled();
        } catch (D) {}
        e.n = k;
        k = navigator.userAgent.toLowerCase();
        if ((h = k.match(/rv:([\d.]+)\) like gecko/))) var q = h[1];
        if ((h = k.match(/msie ([\d.]+)/))) q = h[1];
        h = [];
        if (q)
            for (
                q =
                    "AcroPDF.PDF;Adodb.Stream;AgControl.AgControl;DevalVRXCtrl.DevalVRXCtrl.1;MacromediaFlashPaper.MacromediaFlashPaper;Msxml2.DOMDocument;Msxml2.XMLHTTP;PDF.PdfCtrl;QuickTime.QuickTime;QuickTimeCheckObject.QuickTimeCheck.1;RealPlayer;RealPlayer.RealPlayer(tm) ActiveX Control (32-bit);RealVideo.RealVideo(tm) ActiveX Control (32-bit);rmocx.RealPlayer G2 Control;Scripting.Dictionary;Shell.UIHelper;ShockwaveFlash.ShockwaveFlash;SWCtl.SWCtl;TDCCtl.TDCCtl;WMPlayer.OCX".split(
                        ";"
                    ),
                    k = 0;
                k < q.length;
                k++
            ) {
                var z = q[k];
                try {
                    var C = new ActiveXObject(z);
                    l = {};
                    l.name = z;
                    try {
                        l.version = C.GetVariable("$version");
                    } catch (D) {}
                    try {
                        l.version = C.GetVersions();
                    } catch (D) {}
                    (l.version && 0 < l.version.length) || (l.version = "");
                    h.push(l);
                } catch (D) {}
            }
        else {
            q = navigator.plugins;
            l = {};
            for (k = 0; k < q.length; k++) (z = q[k]), (l[z.name] = 1), h.push(x(z));
            for (k = 0; k < y.length; k++)
                (C = y[k]), l[C] || ((z = q[C]), z && h.push(x(z)));
        }
        q =
            "availHeight availWidth colorDepth bufferDepth deviceXDPI deviceYDPI height width logicalXDPI logicalYDPI pixelDepth updateInterval".split(
                " "
            );
        z = {};
        for (k = 0; q.length > k; k++)
            (C = q[k]), void 0 !== screen[C] && (z[C] = screen[C]);
        q = ["devicePixelRatio", "screenTop", "screenLeft"];
        l = {};
        for (k = 0; q.length > k; k++)
            (C = q[k]), void 0 !== window[C] && (l[C] = window[C]);
        e.p = h;
        e.w = l;
        e.s = z;
        e.sc = f;
        e.tz = n.getTimezoneOffset();
        e.lil = w.sort().join("|");
        e.wil = "";
        f = {};
        try {
            (f.cookie = navigator.cookieEnabled),
                (f.localStorage = !!window.localStorage),
                (f.sessionStorage = !!window.sessionStorage),
                (f.globalStorage = !!window.globalStorage),
                (f.indexedDB = !!window.indexedDB);
        } catch (D) {}
        e.ss = f;
        e.ts.deviceTime = n.getTime();
        e.ts.deviceEndTime = new Date().getTime();
        return this.tdencrypt(e);
    };
    this.collectSdk = function (n) {
        try {
            var e = this,
                f = !1,
                r = e.getLocal("BATQW722QTLYVCRD");
            if (null != r && void 0 != r && "" != r)
                try {
                    var k = JSON.parse(r),
                        g = new Date().getTime();
                    null != k &&
                    void 0 != k.t &&
                    "number" == typeof k.t &&
                    (12e5 >= g - k.t &&
                    void 0 != k.tk &&
                    null != k.tk &&
                    "" != k.tk &&
                    k.tk.startsWith("jdd")
                        ? ((e.deviceInfo.sdkToken = k.tk), (f = !0))
                        : void 0 != k.tk &&
                        null != k.tk &&
                        "" != k.tk &&
                        (e.deviceInfo.sdkToken = k.tk));
                } catch (m) {}
            r = !1;
            e.deviceInfo.isJdApp
                ? ((e.deviceInfo.clientVersion = navigator.userAgent.split(";")[2]),
                (r = 0 < e.compareVersion(e.deviceInfo.clientVersion, "7.0.2")) &&
                !f &&
                e.getJdSdkCacheToken(function (m) {
                    e.deviceInfo.sdkToken = m;
                    (null != m && "" != m && m.startsWith("jdd")) ||
                    e.getJdBioToken(n);
                }))
                : e.deviceInfo.isJrApp &&
                ((e.deviceInfo.clientVersion = navigator.userAgent.match(
                    /clientVersion=([^&]*)(&|$)/
                )[1]),
                (r = 0 < e.compareVersion(e.deviceInfo.clientVersion, "4.6.0")) &&
                !f &&
                e.getJdJrSdkCacheToken(function (m) {
                    e.deviceInfo.sdkToken = m;
                    (null != m && "" != m && m.startsWith("jdd")) ||
                    e.getJdJrBioToken(n);
                }));
            "function" == typeof n && n(e.deviceInfo);
        } catch (m) {}
    };
    this.compareVersion = function (n, e) {
        try {
            if (n === e) return 0;
            var f = n.split(".");
            var r = e.split(".");
            for (n = 0; n < f.length; n++) {
                var k = parseInt(f[n]);
                if (!r[n]) return 1;
                var g = parseInt(r[n]);
                if (k < g) break;
                if (k > g) return 1;
            }
        } catch (m) {}
        return -1;
    };
    this.isWKWebView = function () {
        return this.deviceInfo.userAgent.match(/supportJDSHWK/i) ||
        1 == window._is_jdsh_wkwebview
            ? !0
            : !1;
    };
    this.getErrorToken = function (n) {
        try {
            if (n) {
                var e = (n + "").match(/"token":"(.*?)"/);
                if (e && 1 < e.length) return e[1];
            }
        } catch (f) {}
        return "";
    };
    this.getJdJrBioToken = function (n) {
        var e = this;
        "undefined" != typeof JrBridge &&
        null != JrBridge &&
        "undefined" != typeof JrBridge._version &&
        (0 > e.compareVersion(JrBridge._version, "2.0.0")
            ? console.error(
                "\u6865\u7248\u672c\u4f4e\u4e8e2.0\u4e0d\u652f\u6301bio"
            )
            : JrBridge.callNative(
                {
                    type: e.bioConfig.type,
                    operation: e.bioConfig.operation,
                    biometricData: {
                        bizId: e.bizId,
                        duraTime: e.bioConfig.duraTime,
                        interval: e.bioConfig.interval,
                    },
                },
                function (f) {
                    try {
                        "object" != typeof f && (f = JSON.parse(f)),
                            (e.deviceInfo.sdkToken = f.token);
                    } catch (r) {
                        console.error(r);
                    }
                    null != e.deviceInfo.sdkToken &&
                    "" != e.deviceInfo.sdkToken &&
                    ((f = {
                        tk: e.deviceInfo.sdkToken,
                        t: new Date().getTime(),
                    }),
                        e.store("BATQW722QTLYVCRD", JSON.stringify(f)));
                }
            ));
    };
    this.getJdJrSdkCacheToken = function (n) {
        var e = this;
        try {
            "undefined" == typeof JrBridge ||
            null == JrBridge ||
            "undefined" == typeof JrBridge._version ||
            0 > e.compareVersion(JrBridge._version, "2.0.0") ||
            JrBridge.callNative(
                {
                    type: e.bioConfig.type,
                    operation: 5,
                    biometricData: {
                        bizId: e.bizId,
                        duraTime: e.bioConfig.duraTime,
                        interval: e.bioConfig.interval,
                    },
                },
                function (f) {
                    var r = "";
                    try {
                        "object" != typeof f && (f = JSON.parse(f)), (r = f.token);
                    } catch (k) {
                        console.error(k);
                    }
                    null != r &&
                    "" != r &&
                    "function" == typeof n &&
                    (n(r),
                    r.startsWith("jdd") &&
                    ((f = {
                        tk: r,
                        t: new Date().getTime(),
                    }),
                        e.store("BATQW722QTLYVCRD", JSON.stringify(f))));
                }
            );
        } catch (f) {}
    };
    this.getJdBioToken = function (n) {
        var e = this;
        n = JSON.stringify({
            businessType: "bridgeBiologicalProbe",
            callBackName: "_bioDeviceCb",
            params: {
                pin: "",
                jsonData: {
                    type: e.bioConfig.type,
                    operation: e.bioConfig.operation,
                    data: {
                        bizId: e.bizId,
                        duraTime: e.bioConfig.duraTime,
                        interval: e.bioConfig.interval,
                    },
                    biometricData: {
                        bizId: e.bizId,
                        duraTime: e.bioConfig.duraTime,
                        interval: e.bioConfig.interval,
                    },
                },
            },
        });
        e.isWKWebView()
            ? window.webkit.messageHandlers.JDAppUnite.postMessage({
                method: "notifyMessageToNative",
                params: n,
            })
            : window.JDAppUnite && window.JDAppUnite.notifyMessageToNative(n);
        window._bioDeviceCb = function (f) {
            try {
                var r = "object" == typeof f ? f : JSON.parse(f);
                if (void 0 != r && null != r && "0" != r.status) return;
                null != r.data.token &&
                void 0 != r.data.token &&
                "" != r.data.token &&
                (e.deviceInfo.sdkToken = r.data.token);
            } catch (k) {
                (f = e.getErrorToken(f)),
                null != f && "" != f && (e.deviceInfo.sdkToken = f);
            }
            null != e.deviceInfo.sdkToken &&
            "" != e.deviceInfo.sdkToken &&
            ((f = {
                tk: e.deviceInfo.sdkToken,
                t: new Date().getTime(),
            }),
                e.store("BATQW722QTLYVCRD", JSON.stringify(f)));
        };
    };
    this.getJdSdkCacheToken = function (n) {
        try {
            var e = this,
                f = JSON.stringify({
                    businessType: "bridgeBiologicalProbe",
                    callBackName: "_bioDeviceSdkCacheCb",
                    params: {
                        pin: "",
                        jsonData: {
                            type: e.bioConfig.type,
                            operation: 5,
                            data: {
                                bizId: e.bizId,
                                duraTime: e.bioConfig.duraTime,
                                interval: e.bioConfig.interval,
                            },
                            biometricData: {
                                bizId: e.bizId,
                                duraTime: e.bioConfig.duraTime,
                                interval: e.bioConfig.interval,
                            },
                        },
                    },
                });
            e.isWKWebView()
                ? window.webkit.messageHandlers.JDAppUnite.postMessage({
                    method: "notifyMessageToNative",
                    params: f,
                })
                : window.JDAppUnite && window.JDAppUnite.notifyMessageToNative(f);
            window._bioDeviceSdkCacheCb = function (r) {
                var k = "";
                try {
                    var g = "object" == typeof r ? r : JSON.parse(r);
                    if (void 0 != g && null != g && "0" != g.status) return;
                    k = g.data.token;
                } catch (m) {
                    k = e.getErrorToken(r);
                }
                null != k &&
                "" != k &&
                "function" == typeof n &&
                (n(k),
                k.startsWith("jdd") &&
                ((r = {
                    tk: k,
                    t: new Date().getTime(),
                }),
                    e.store("BATQW722QTLYVCRD", JSON.stringify(r))));
            };
        } catch (r) {}
    };
    this.store = function (n, e) {
        try {
            this.setCookie(n, e);
        } catch (f) {}
        try {
            window.localStorage && window.localStorage.setItem(n, e);
        } catch (f) {}
        try {
            window.sessionStorage && window.sessionStorage.setItem(n, e);
        } catch (f) {}
        try {
            window.globalStorage &&
            window.globalStorage[".localdomain"].setItem(n, e);
        } catch (f) {}
        try {
            this.db(n, _JdEid);
        } catch (f) {}
    };
    this.getLocal = function (n) {
        var e = {},
            f = null;
        try {
            var r = document.cookie.replace(
                new RegExp("(?:(?:^|.*;\\s*)" + n + "\\s*\\=\\s*([^;]*).*$)|^.*$"),
                "$1"
            );
            0 !== r.length && (e.cookie = r);
        } catch (g) {}
        try {
            window.localStorage &&
            null !== window.localStorage &&
            0 !== window.localStorage.length &&
            (e.localStorage = window.localStorage.getItem(n));
        } catch (g) {}
        try {
            window.sessionStorage &&
            null !== window.sessionStorage &&
            (e.sessionStorage = window.sessionStorage[n]);
        } catch (g) {}
        try {
            p.globalStorage &&
            (e.globalStorage = window.globalStorage[".localdomain"][n]);
        } catch (g) {}
        try {
            d &&
            "function" == typeof d.load &&
            "function" == typeof d.getAttribute &&
            (d.load("jdgia_user_data"), (e.userData = d.getAttribute(n)));
        } catch (g) {}
        try {
            E.indexedDbId && (e.indexedDb = E.indexedDbId);
        } catch (g) {}
        try {
            E.webDbId && (e.webDb = E.webDbId);
        } catch (g) {}
        try {
            for (var k in e)
                if (32 < e[k].length) {
                    f = e[k];
                    break;
                }
        } catch (g) {}
        try {
            if (null == f || "undefined" === typeof f || 0 >= f.length) f = u(n);
        } catch (g) {}
        return f;
    };
    this.createWorker = function () {
        if (window.Worker) {
            try {
                var n = new Blob(
                    [
                        "onmessage = function (event) {\n    var data = JSON.parse(event.data);\n    try {\n        var httpRequest;\n        try {\n            httpRequest = new XMLHttpRequest();\n        } catch (h) {}\n        if (!httpRequest)\n            try {\n                httpRequest = new (window['ActiveXObject'])('Microsoft.XMLHTTP')\n            } catch (l) {}\n        if (!httpRequest)\n            try {\n                httpRequest = new (window['ActiveXObject'])('Msxml2.XMLHTTP')\n            } catch (r) {}\n        if (!httpRequest)\n            try {\n                httpRequest = new (window['ActiveXObject'])('Msxml3.XMLHTTP')\n            } catch (n) {}\n\n        if(data){\n            httpRequest['open']('POST', data.url, false);\n            httpRequest['setRequestHeader']('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');\n            httpRequest['onreadystatechange'] = function () {\n                if (4 === httpRequest['readyState'] && 200 === httpRequest['status']) {\n                    postMessage(httpRequest.responseText);\n                }\n            };\n            httpRequest['send'](data.data);\n        }\n\n    }catch (e){console.error(e);}\n};",
                    ],
                    {
                        type: "application/javascript",
                    }
                );
            } catch (e) {
                (window.BlobBuilder =
                    window.BlobBuilder ||
                    window.WebKitBlobBuilder ||
                    window.MozBlobBuilder),
                    (n = new BlobBuilder()),
                    n.append(
                        "onmessage = function (event) {\n    var data = JSON.parse(event.data);\n    try {\n        var httpRequest;\n        try {\n            httpRequest = new XMLHttpRequest();\n        } catch (h) {}\n        if (!httpRequest)\n            try {\n                httpRequest = new (window['ActiveXObject'])('Microsoft.XMLHTTP')\n            } catch (l) {}\n        if (!httpRequest)\n            try {\n                httpRequest = new (window['ActiveXObject'])('Msxml2.XMLHTTP')\n            } catch (r) {}\n        if (!httpRequest)\n            try {\n                httpRequest = new (window['ActiveXObject'])('Msxml3.XMLHTTP')\n            } catch (n) {}\n\n        if(data){\n            httpRequest['open']('POST', data.url, false);\n            httpRequest['setRequestHeader']('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');\n            httpRequest['onreadystatechange'] = function () {\n                if (4 === httpRequest['readyState'] && 200 === httpRequest['status']) {\n                    postMessage(httpRequest.responseText);\n                }\n            };\n            httpRequest['send'](data.data);\n        }\n\n    }catch (e){console.error(e);}\n};"
                    ),
                    (n = n.getBlob());
            }
            try {
                this.worker = new Worker(URL.createObjectURL(n));
            } catch (e) {}
        }
    };
    this.reportWorker = function (n, e, f, r) {
        try {
            null != this.worker &&
            (this.worker.postMessage(
                JSON.stringify({
                    url: n,
                    data: e,
                    success: !1,
                    async: !1,
                })
            ),
                (this.worker.onmessage = function (k) {}));
        } catch (k) {}
    };
})();

function td_collect_exe() {
    _fingerprint_step = 8;
    var t = td_collect.collect();
    td_collect.collectSdk();
    var u = "string" === typeof orderId ? orderId : "",
        v = "undefined" !== typeof jdfp_pinenp_ext && jdfp_pinenp_ext ? 2 : 1;
    u = {
        pin: _jdJrTdCommonsObtainPin(v),
        oid: u,
        p: "https:" == document.location.protocol ? "s" : "h",
        fp: risk_jd_local_fingerprint,
        ctype: v,
        v: "2.7.10.4",
        f: "3",
    };
    try {
        (u.o = _CurrentPageUrl), (u.qs = _url_query_str);
    } catch (w) {}
    _fingerprint_step = 9;
    0 >= _JdEid.length &&
    ((_JdEid = td_collect.obtainLocal()), 0 < _JdEid.length && (_eidFlag = !0));
    u.fc = _JdEid;
    try {
        u.t = jd_risk_token_id;
    } catch (w) {}
    try {
        if ("undefined" != typeof gia_fp_qd_uuid && 0 <= gia_fp_qd_uuid.length)
            u.qi = gia_fp_qd_uuid;
        else {
            var x = _JdJrRiskClientStorage.jdtdstorage_cookie("qd_uid");
            u.qi = void 0 == x ? "" : x;
        }
    } catch (w) {}
    "undefined" != typeof jd_shadow__ &&
    0 < jd_shadow__.length &&
    (u.jtb = jd_shadow__);
    try {
        td_collect.deviceInfo &&
        void 0 != td_collect.deviceInfo &&
        null != td_collect.deviceInfo.sdkToken &&
        "" != td_collect.deviceInfo.sdkToken
            ? ((u.stk = td_collect.deviceInfo.sdkToken), (td_collect.isRpTok = !0))
            : (td_collect.isRpTok = !1);
    } catch (w) {
        td_collect.isRpTok = !1;
    }
    x = td_collect.tdencrypt(u);
    // console.log(u)
    return { a: x, d: t };
}

function _jdJrTdCommonsObtainPin(t) {
    var u = "";
    "string" === typeof jd_jr_td_risk_pin && 1 == t
        ? (u = jd_jr_td_risk_pin)
        : "string" === typeof pin
        ? (u = pin)
        : "object" === typeof pin &&
        "string" === typeof jd_jr_td_risk_pin &&
        (u = jd_jr_td_risk_pin);
    return u;
}

function getBody(userAgent, url = document.location.href) {
    navigator.userAgent = userAgent;
    let href = url;
    let choose = /((https?:)\/\/([^\/]+))(.+)/.exec(url);
    let [, origin, protocol, host, pathname] = choose;
    document.location.href = href;
    document.location.origin = origin;
    document.location.protocol = protocol;
    document.location.host = host;
    document.location.pathname = pathname;
    const JF = new JdJrTdRiskFinger();
    let fp = JF.f.get(function (t) {
        risk_jd_local_fingerprint = t;
        return t;
    });
    let arr = td_collect_exe();
    return { fp, ...arr };
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date(new Date().getTime()+new Date().getTimezoneOffset()*60*1000+8*60*60*1000);let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}