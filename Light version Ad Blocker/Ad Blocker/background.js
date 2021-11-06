const defaultFilters = [
"*://*.tpc.googlesyndication.com/*",
"*://*.ads.google.com/*",
"*://*.adservice.google.com/*",
"*://*.googleadservices.com/*",
"*://*.an.facebook.com/*",
"*://*.ads-api.twitter.com/*",
"*://*.an.facebook.com/*",
"*://*.advertising.twitter.com/*",
"*://*.ads-dev.pinterest.com/*",
"*://*.widgets.pinterest.com/*",
"*://*.analytics-sg.tiktok.com/*",
"*://*.d.reddit.com/*",
"*://*.adblock-tester.com/banners/pr_advertising_ads_banner.gif/*",
"*://*.adblock-tester.com/banners/pr_advertising_ads_banner.png/*",
"*://*.d2wy8f7a9ursnm.cloudfront.net/*",
"*://*.browser.sentry-cdn.com/*",
"*://*.google-analytics.com/*",
"*://c.bebi.com/*",
"*://*.cdn.sb-inv1.com/*",
"*://run-syndicate.com/*",
"*://redir.bebi.com/*",
"*://c.bebi.com/*",
"*://platform.bidgear.com/*",
"*://*.img.adskeeper.co.uk/*",
"*://st.bebi.com/micro-logo.png*",
"*://st.bebi.com/*",
"*://*.searchsecurer.com/*",
"*://*.lparchv.click/*",
"*://stitchkidney.com/*",
"*://lcdn.runative-syndicate.com/*",
"*://onmarshtompor.com/*",
"*://*.cdn.adskeeper.co.uk/*",
"*://*.adskeeper.co.uk/*",
"*://*.cdn.sb4you1.com/*",
"*://*.widgets.adskeeper.com/*",
"*://*.offerimage.com/*",
"*://in-page-push.com/*",
"*://*.pinup-casino.com.ru/*",
"*://*.www.bet365.com/*",
"*://*.media.opencdn.co/?id=55344746756c38d*",
"*://*.media.opencdn.co/?id=55344746756c343d*",
"*://*.media.opencdn.co/?id=55344746756c6b3d*",
"*://*.media.opencdn.co/?id=55344746756c673d*",
"*://*.direct.apus.tech/*",
"*://frontierdough.com/*",
"*://adsco.re/*",
"*://tempest.services.disqus.com/*",
"*://*.disqus.com/*",
"*://*.toglooman.com/*",
"*://*.yukon-login.ca/*",
"*://*.rollectricbyi.xyz/*",
"*://*.unfudgetljbf.xyz/*",
"*://*.stumbleupon.com/*",
"*://*.cdn.tynt.com/*",
"*://*.puporn.com/*",
"*://*.live.maroopush.com/*",
"*://*.tonnection.xyz/*",
"*://*.steamcdn-a.akamaihd.net/*",
"*://*.stats.wp.com/*",
"*://*.rauch.cc/*",
"*://*.videoranked.com/*",
"*://*.worldstatistics.live/*",
"*://*.server.cpmstar.com/*",
"*://*.ssl.cdne.cpmstar.com/*",
"*://*.xn--b1aecbahcjcu5ad2bm4b.xn--p1ai/*",
"*://*.sb.scorecardresearch.com/*",
"*://*.ssl.cdne.cpmstar.com/*",
"*://*.jsc.mgid.com/*",
"*://*.y.healthzap.co/*",
"*://*.healthzap.co/*",
"*://*.vdo.ai/*",
"*://*.hotjar.com/*",
"*://*.static.hotjar.com/*",
"*://*.media.fastclick.net/*",
"*://*.pixel.facebook.com/*",
"*://*.analytics.facebook.com/*",
"*://*.ads.facebook.com/*",
"*://*.pagead2.googlesyndication.com/*",
"*://*.pagead2.googleadservices.com/*",
"*://*.static.media.net/*",
"*://*.media.net/*",
"*://*.adservetx.media.net/*",
"*://*.doubleclick.net/*",
"*://*.ad.doubleclick.net/*",
"*://*.browser.sentry-cdn.com/*",
"*://*.notify.bugsnag.com/*",
"*://*.api.bugsnag.com/*",
"*://*.app.bugsnag.com/*",
"*://*.sessions.bugsnag.com/*",
"*://*.ads.youtube.com/*",
"*://*.youtube.cleverads.vn/*",
"*://*.static.ads-twitter.com/*",
"*://*.ads.linkedin.com/*",
"*://*.analytics.pointdrive.linkedin.com/*",
"*://*.aan.amazon.com/*",
"*://*.aax.amazon-adsystem.com/*",
"*://*.c.amazon-adsystem.com/*",
"*://*.mads.amazon-adsystem.com/*",
"*://*.mouseflow.com/*",
"*://*.a.mouseflow.com/*",
"*://*.freshmarketer.com/*",
"*://*.cdn.luckyorange.com/*",
"*://*.w1.luckyorange.com/*",
"*://*.upload.luckyorange.net/*",
"*://*.cs.luckyorange.net/*",
"*://*.settings.luckyorange.net/*",
"*://*.analytics.tiktok.com/*",
"*://*.ads.tiktok.com/*",
"*://*.ads.pinterest.com/*",
"*://*.log.pinterest.com/*",
"*://*.ct.pinterest.com/*",
"*://*.analytics.pinterest.com/*",
"*://*.trk.pinterest.com/*",
"*://*.ads.reddit.com/*",
"*://*.events.redditmedia.com/*",
"*://*.rereddit.com/*",
"*://*.ads.yahoo.com/*",
"*://*.global.adserver.yahoo.com/*",
"*://*.analytics.yahoo.com/*",
"*://*.ads.yap.yahoo.com/*",
"*://*.appmetrica.yandex.com/*",
"*://*.yandexadexchange.net/*",
"*://*.analytics.mobile.yandex.net/*",
"*://*.extmaps-api.yandex.net/*",
"*://*.adsdk.yandex.ru/*",
"*://*.securemetrics.apple.com/*",
"*://*.supportmetrics.apple.com/*",
"*://*.metrics.icloud.com/*",
"*://*.metrics.mzstatic.com/*",
"*://*.samsungads.com/*",
"*://*.smetrics.samsung.com/*",
"*://*.samsung-com.112.2o7.net/*",
"*://*.business.samsungusa.com/*",
"*://*.analytics-api.samsunghealthcn.com/*",
"*://*.config.samsungads.com/*",
"*://*.analytics.oneplus.cn/*",
"*://*.click.oneplus.cn/*",
"*://*.click.oneplus.com/*",
"*://*.open.oneplus.net/*",
"*://*.logservice.hicloud.com/*",
"*://*.logservice1.hicloud.com/*",
"*://*.logbak.hicloud.com/*",
"*://*.api.ad.xiaomi.com/*",
"*://*.data.mistat.xiaomi.com/*",
"*://*.data.mistat.intl.xiaomi.com/*",
"*://*.data.mistat.india.xiaomi.com/*",
"*://*.data.mistat.rus.xiaomi.com/*",
"*://*.sdkconfig.ad.xiaomi.com/*",
"*://*.sdkconfig.ad.intl.xiaomi.com/*",
"*://*.globalapi.ad.xiaomi.com/*",
"*://*.tracking.miui.com/*",
"*://*.sa.api.intl.miui.com/*",
"*://*.tracking.intl.miui.com/*",
"*://*.tracking.india.miui.com/*",
"*://*.tracking.rus.miui.com/*",
"*://*.aax-us-east.amazon-adsystem.com/*",
"*://*.wms-na.amazon-adsystem.com/*",
"*://*.c.adskeeper.com/*",
"*://*.cdn.bncloudfl.com/*",
"*://*.cdn.cloudimagesb.com/*",
"*://*.kgdvs9ov3l2aasw4nuts.com/*",
"*://*.cdn.cloudfrale.com/*",
"*://*.canyoublockit.com/wp-content/uploads/*",
"*://*.betalonflamechan.com/*",
"*://*.mybetterdl.com/*",
"*://*.coinsbit.io/*",
"*://*.gemorul.com/*",
"*://*.pybushobi.com/*",
"*://*.joaglouwulin.com/*",
"*://*.p374865.clksite.com/adServe/*",
"*://*.genshin.mihoyo.com/*",
"*://*.expertist.xyz/*",
"*://*.c3.taboola.com/*",
"*://*.hero-wars.com/*",
"*://*.images.taboola.com/*",
"*://*.cdn.taboola.com/*",
"*://*.img.connatix.com/*",
"*://*.cdn.realsport101.com/*",
"*://*.masdk.googleapis.com/*",
"*://*.cd.connatix.com/*",
"*://*.iplogger.org/*",
"*://*.2no.co/*",
"*://*.yip.su/*",
"*://*.ezstat.ru/*",
"*://*.grabify.link/*",
"*://*.cutt.ly/*",
"*://*.gg.gg/*",
"*://*.shorte.st/*",
"*://*.adf.ly/*",
"*://*.bc.vc/*",
"*://*.soo.gd/*",
"*://*.ouo.io/*",
"*://*.zzb.bz/*",
"*://*.adfoc.us/*",
"*://*.goo.gl/*",
"*://*.x1heref1le1x.com/*",
"*://*.u-9204.onetouch7.info/*",
"*://*.sawzj.xdwhatijunn.xyz/*",
"*://*.trafficmoon.com/*",
"*://*.eu.contestdn.click/*",
"*://*.data-beacons.s-onetag.com/*",
"*://*.cdnjs.cloudflare.com/*",
"*://*.ajax.googleapis.com/*",
"*://*.fonts.gstatic.com/*",
"*://*.s.gravatar.com/*",
"*://*.ovvan.xdwhatijunn.xyz/*",
"*://*.s.rankmath.com/*",
"*://*.clickup.com/*",
"*://*.rauch.cc/*",
"*://*.a.adtng.com/*",
"*://*.mrpcgamer.co/wp-includes/*",
"*://*.affiliationjs.s3.amazonaws.com/*",
"*://*.advertising-api-eu.amazon.com/*",
"*://*.luckyorange.com/*",
"*://*.app.getsentry.com/*",
"*://*.mrpcgamer.co/wp-includes/js*",
"*://*.d1f05vr3sjsuy7.cloudfront.net/*",
"*://*.ar-gamez.com/*",
"*://*.ad.admitad.com/*",
"*://*.adtago.s3.amazonaws.com/*",
"*://*.analyticsengine.s3.amazonaws.com/*",
"*://*.advice-ads.s3.amazonaws.com/*",
"*://*.pr_advertising_ads_banner.swf/*",
"*://*.banners-hw.trafficfactory.biz/*",
"*://*.static.trafficjunky.com/*",
"*://*.dliscord.com/*",
"*://*.rpc-php.trafficfactory.biz/*",
"*://*.s3t3d2y7.ackcdn.net/*",
"*://*.fgn.cdn.serverable.com/*",
"*://*.cdn.creativesumo.com/*",
"*://*.hentaigamer.org/wp-content/*",
"*://*.albeitinflame.com/*",
"*://*.c0.pubmine.com/*",
"*://*.advertere.zamunda.net/*",
"*://*.track.coinverti.com/*",
"*://*.yt3.ggpht.com/*",
"*://*.curiositystream.com/*",
"*://*.cdn.adskeeper.co.uk/*",
"*://*.s-img.adskeeper.co.uk/*",
"*://*.s-img.steepto.com/*",
"*://*.steepto.com/*",
"*://*.adserver.adreactor.com/*",
"*://*.adskeeper.co.uk/*",
"*://*.cdn.sb4you1.com/*",
"*://*.p249083.mycdn.co/*",
"*://*.thestudent.world/*"
]

chrome.webRequest.onBeforeRequest.addListener(
    function(details) { return { cancel: true }},
    { urls: defaultFilters },
    ["blocking"]
)

