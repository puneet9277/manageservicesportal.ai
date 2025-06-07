export const awsInstances = [
  {
    instanceId: "i-1234567890abcdef0",
    status: "running",
    alarms: [
      { name: "CPU Usage High", status: "OK" },
      { name: "Memory Usage", status: "ALARM" },
    ],
  },
  {
    instanceId: "i-0987654321fedcba0",
    status: "stopped",
    alarms: [{ name: "Disk Usage", status: "OK" }],
  },
  {
    instanceId: "i-1122334455667788",
    status: "running",
    alarms: [
      { name: "Network In", status: "OK" },
      { name: "Network Out", status: "OK" },
    ],
  },
  {
    instanceId: "i-2233445566778899",
    status: "pending",
    alarms: [{ name: "CPU Usage High", status: "ALARM" }],
  },
  {
    instanceId: "i-3344556677889900",
    status: "running",
    alarms: [
      { name: "Disk Usage", status: "OK" },
      { name: "Memory Usage", status: "OK" },
    ],
  },
  {
    instanceId: "i-4455667788990011",
    status: "stopped",
    alarms: [{ name: "CPU Usage High", status: "OK" }],
  },
];
