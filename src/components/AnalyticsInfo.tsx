
import { VenuePhotos } from "@/service/fetchVenuePhotosFromApi";
import { VenueUser } from "@/service/fetchVenueUsersFromApi";
import * as React from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type AnalyticsInfoProps = {
  venueUsers: VenueUser[];
  venuePhotos: VenuePhotos[];
}

export default function AnalyticsInfo(props: AnalyticsInfoProps) {
  const intl = useIntl();
  
  // Ensure we have valid arrays to work with
  const users = Array.isArray(props.venueUsers) ? props.venueUsers : [];
  const photos = Array.isArray(props.venuePhotos) ? props.venuePhotos : [];
  
  console.log("Analytics data received:");
  console.log("Users data:", props.venueUsers);
  console.log("Photos data:", props.venuePhotos);
  console.log("Processed users count:", users.length);
  console.log("Processed photos count:", photos.length);
  
  const chartData = React.useMemo(() => {
    const counts: Record<string, { photo: number; user: number }> = {};
    
    // Process photos
    photos.forEach(photo => {
      try {
        const date = new Date(`${photo.created_at}Z`).toISOString().split('T')[0];
        if (!counts[date]) counts[date] = { photo: 0, user: 0 };
        counts[date].photo += 1;
      } catch (error) {
        console.error("Error processing photo date:", photo.created_at, error);
      }
    });
    
    // Process users
    users.forEach(user => {
      try {
        const date = new Date(`${user.created_at}Z`).toISOString().split('T')[0];
        if (!counts[date]) counts[date] = { photo: 0, user: 0 };
        counts[date].user += 1;
      } catch (error) {
        console.error("Error processing user date:", user.created_at, error);
      }
    });
    
    const result = Object.entries(counts)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, { photo, user }]) => ({ date, photo, user }));
    
    console.log("Chart data processed:", result);
    return result;
  }, [photos, users]);

  const chartConfig = {
    photo: {
      label: intl.formatMessage({ id: "venueDashboard.analytics.chart.photo" }),
      color: "black",
    },
    user: {
      label: intl.formatMessage({ id: "venueDashboard.analytics.chart.user" }),
      color: "black",
    },
  } satisfies ChartConfig

  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("photo")

  const total = React.useMemo(
    () => {
      const totals = {
        photo: photos.length,
        user: users.length,
      };
      console.log("Calculated totals:", totals);
      return totals;
    },
    [photos, users]
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle><FormattedMessage id="venueDashboard.analytics.title" /></CardTitle>
          <CardDescription>
            <FormattedMessage id="venueDashboard.analytics.description" />
          </CardDescription>
        </div>
        <div className="flex flex-1">
          {["photo", "user"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString()
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
