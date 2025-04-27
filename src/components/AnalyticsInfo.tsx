import { VenuePhotos } from "@/service/fetchVenuePhotosFromApi";
import { VenueUser } from "@/service/fetchVenueUsersFromApi";
import * as React from "react"
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
  const chartData = React.useMemo(() => {
    const counts: Record<string, { photo: number; user: number }> = {};
    props.venuePhotos.forEach(photo => {
      const date = new Date(`${photo.created_at}Z`).toISOString().split('T')[0];
      if (!counts[date]) counts[date] = { photo: 0, user: 0 };
      counts[date].photo += 1;
    });
    props.venueUsers.forEach(user => {
      const date = new Date(`${user.created_at}Z`).toISOString().split('T')[0];
      if (!counts[date]) counts[date] = { photo: 0, user: 0 };
      counts[date].user += 1;
    });
    return Object.entries(counts)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, { photo, user }]) => ({ date, photo, user }));
  }, [props.venuePhotos, props.venueUsers]);

  const chartConfig = {
    photo: {
      label: "Total photos taken",
      color: "black",
    },
    user: {
      label: "Total users",
      color: "black",
    },
  } satisfies ChartConfig

  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("photo")

  const total = React.useMemo(
    () => ({
      photo: chartData.reduce((acc, curr) => acc + curr.photo, 0),
      user: chartData.reduce((acc, curr) => acc + curr.user, 0),
    }),
    [chartData]
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Your venue Analytics</CardTitle>
          <CardDescription>
            Showing total photos taken and users
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
