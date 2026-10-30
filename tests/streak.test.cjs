const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
process.env.TZ = 'America/Toronto';
const { localDay, dayNumber, streakSummary, recordPracticeDay } = require(path.join(process.env.LITSPARK_TEST_BUILD, 'streak.js'));
const { defaultProgress, decodeProgress, completeActivity } = require(path.join(process.env.LITSPARK_TEST_BUILD, 'learningState.js'));
const { completeUnitActivity, recordUnitAnswer } = require(path.join(process.env.LITSPARK_TEST_BUILD, 'journeyState.js'));
const now = new Date(2026,9,29,12);
test('no practice means zero current and longest streak',()=>{
 assert.deepEqual(streakSummary([],now),{current:0,longest:0,practicedToday:false,today:'2026-10-29'});
});
test('several activities on one day extend a streak only once',()=>{
 const a=recordPracticeDay(defaultProgress,'2026-10-29T15:00:00Z');
 const b=recordPracticeDay(a,'2026-10-29T22:00:00Z');
 assert.equal(a,b); assert.deepEqual(a.practiceDays,['2026-10-29']); assert.equal(streakSummary(a.practiceDays,now).current,1);
});
test('consecutive local days extend the streak and yesterday remains active',()=>{
 const result=streakSummary(['2026-10-26','2026-10-27','2026-10-28'],now);
 assert.equal(result.current,3);assert.equal(result.practicedToday,false);
 const continued=recordPracticeDay({...defaultProgress,practiceDays:['2026-10-26','2026-10-27','2026-10-28']},'2026-10-29T15:00:00Z');
 assert.equal(streakSummary(continued.practiceDays,now).current,4);
});
test('missing a full calendar day resets current but preserves best streak',()=>{
 const days=['2026-10-23','2026-10-24','2026-10-25','2026-10-26'];
 assert.equal(streakSummary(days,now).current,0);assert.equal(streakSummary(days,now).longest,4);
 const next=recordPracticeDay({...defaultProgress,practiceDays:days},'2026-10-29T15:00:00Z');
 assert.equal(streakSummary(next.practiceDays,now).current,1);assert.equal(streakSummary(next.practiceDays,now).longest,4);
});
test('calendar counting works across daylight saving changes',()=>{
 assert.equal(dayNumber('2026-03-09')-dayNumber('2026-03-08'),1);
 assert.equal(streakSummary(['2026-03-07','2026-03-08','2026-03-09'],new Date(2026,2,9,12)).current,3);
 assert.equal(streakSummary(['2026-10-31','2026-11-01','2026-11-02'],new Date(2026,10,2,12)).current,3);
});
test('local dates, not UTC dates, define practice days',()=>{
 assert.equal(localDay(new Date('2026-10-30T01:00:00Z')),'2026-10-29');
 assert.equal(localDay(new Date('2026-10-30T05:00:00Z')),'2026-10-30');
});
test('replaying a reading activity can continue the streak without adding XP or score',()=>{
 const first=completeActivity(defaultProgress,'reading:1',3,4,10,'2026-10-28T15:00:00Z');
 const next=completeActivity(first,'reading:1',4,4,10,'2026-10-29T15:00:00Z');
 assert.equal(next.experiencePoints,10);assert.equal(next.scoreCount,1);assert.equal(streakSummary(next.practiceDays,now).current,2);
});
test('guided unit replays also count days without duplicate rewards',()=>{
 let progress=defaultProgress;for(const [i,a]of [1,0,2].entries())progress=recordUnitAnswer(progress,i,a);
 progress=completeUnitActivity(progress,'reading','2026-10-28T15:00:00Z');
 progress=completeUnitActivity(progress,'reading','2026-10-29T15:00:00Z');
 assert.equal(progress.experiencePoints,10);assert.equal(streakSummary(progress.practiceDays,now).current,2);
});
test('migration recovers only known dates and rejects malformed day history',()=>{
 const result=decodeProgress({experiencePoints:99,lastSessionDate:'2026-10-29T15:00:00Z',completions:{'reading:1':{score:1,total:1,xp:10,completedAt:'2026-10-28T15:00:00Z'}}});
 assert.deepEqual(result.practiceDays,['2026-10-28','2026-10-29']);assert.equal(result.experiencePoints,99);
 assert.throws(()=>decodeProgress({practiceDays:['2026-02-30']}));
 assert.throws(()=>decodeProgress({practiceDays:'2026-10-29'}));
});
test('streaks update across midnight and ignore future dates for the current count',()=>{
 const days=['2026-10-28','2026-10-29','2026-11-01'];
 assert.equal(streakSummary(days,new Date(2026,9,30,0,1)).current,2);
 assert.equal(streakSummary(days,new Date(2026,9,31,0,1)).current,0);
});
