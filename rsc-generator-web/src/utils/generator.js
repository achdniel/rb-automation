import template from "../template";

export const isValidIP = (ip) => {
  const ipOnly = ip.includes("/") ? ip.split("/")[0] : ip;

  const regex =
    /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;

  return regex.test(ipOnly);
};

export const generateConfig = (data, version) => {
  let output = template;

  const wan = version === "mpls" ? "sfp-sfpplus1" : "ether1";

  let ip = data.ipAddress?.trim() || data["IP Address"]?.trim();

  // ✅ VALIDATION HERE
  if (!ip || !isValidIP(ip)) {
    throw new Error("Invalid IP Address");
  }

  // keep your existing logic
  if (!ip.includes("/")) ip += "/22";

  const replacements = {
    "{{ WAN }}": wan,
    "{{ Hostname }}": data.hostname || data.Hostname,
    "{{ Identity }}": data.identity || data.Identity,
    "{{ IP Address }}": ip,
  };

  Object.entries(replacements).forEach(([key, value]) => {
    output = output.replace(new RegExp(key, "g"), value);
  });

  return output;
};