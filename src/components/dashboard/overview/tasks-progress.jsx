import React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ListBullets as ListBulletsIcon } from "@phosphor-icons/react/dist/ssr/ListBullets";

// Function to format the Firebase timestamp
function formatTimestamp(timestamp) {
  const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
  const date = new Date(milliseconds);
  return date.toLocaleString(); // Full date and time
}

export function TasksProgress({ sx, meetings }) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)

  // Filter meetings for the current month with status 'completed'
  const completedMeetings = meetings?.filter(({ status, eventDetails }) => {
    const startDate = new Date(formatTimestamp(eventDetails.startTime));
    return status === "completed" &&
      startDate.getFullYear() === currentYear &&
      startDate.getMonth() === currentMonth;
  }) || [];

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: "flex-start", justifyContent: "space-between" }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" gutterBottom variant="overline">
                Successfull Appointments This Month
              </Typography>
              {completedMeetings.length > 0 ? (
                <Typography variant="h4">{completedMeetings.length}</Typography>
              ) : (
                <Typography variant="h4" color="text.secondary">No appointments found</Typography>
              )}
            </Stack>
            <Avatar sx={{ backgroundColor: "var(--mui-palette-warning-main)", height: "56px", width: "56px" }}>
              <ListBulletsIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
