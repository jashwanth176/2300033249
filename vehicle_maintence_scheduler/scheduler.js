const SERVER_URL = process.env.SERVER_URL;
const TOKEN = process.env.ACCESS_TOKEN;

function maxImpact(hours, vehicles){
    const n = vehicles.length;
    const dp = Array(n+1).fill(0).map(() => Array(hours+1).fill(0));
    for(let i = 1; i<=n; i++){
        const v = vehicles[i-1];
        const d = v.Duration;
        const i = v.Impact;
        for (let w = 0; w <= hours;w++){
            if (d <= w)
                dp[i][w] = Math.max(dp[i-1][w], dp[i-1][w-d]+i);
            else
                dp[i][w] = dp[i-1][w];
        }
    }
    let res = dp[n][hours];
    let w = hours;
    const sel = [];
    for (let i = n; i>0 && res > 0; i--){
        if (res === dp[i-1][w]) continue;
        else{
            const v = vehicles[i-1];
            sel.push(v.TaskID);
            res -= v.Impact;
            w -= v.Duration;
        }
    }
    return {
        maxImpact: dp[n][hours],
        selectedIDs: sel
    }
}

async function scheduleDepots(){
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
    };
    const dRes = await fetch(`${SERVER_URL}/depots`, {headers});
    const dData = await dRes.json();
    const d = dData.depots;
    const vRes = await fetch(`${SERVER_URL}/vehicles`, {headers});
    const vData = await vRes.json();
    const v = vData.vehicles;

    for (const depot of d){
        const r = maxImpact(depot.MechanicHours, v);
        const msg = `Depot ${depot.ID}: Max Impact = ${r.maxImpact}, Scheduled Tasks = [${r.selectedIDs.join(", ")}]`;
        await sendLog("info", "scheduler", msg);
    }
}

module.exports = {scheduleDepots};