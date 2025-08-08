import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Mail, 
  Users, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalContacts: number;
  emailsSent: number;
  emailsRemaining: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalContacts: 0,
    emailsSent: 0,
    emailsRemaining: 0,
    openRate: 0,
    clickRate: 0,
    unsubscribeRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch campaigns
      const { data: campaigns, error: campaignsError } = await supabase
        .from("campaigns")
        .select("*");

      if (campaignsError) throw campaignsError;

      // Fetch contacts
      const { data: contacts, error: contactsError } = await supabase
        .from("contacts")
        .select("*");

      if (contactsError) throw contactsError;

      // Fetch email logs for stats
      const { data: emailLogs, error: logsError } = await supabase
        .from("email_logs")
        .select("*");

      if (logsError) throw logsError;

      // Calculate stats
      const totalCampaigns = campaigns?.length || 0;
      const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
      const totalContacts = contacts?.length || 0;
      const emailsSent = emailLogs?.filter(log => log.status === 'sent').length || 0;
      const emailsOpened = emailLogs?.filter(log => log.status === 'opened').length || 0;
      const emailsClicked = emailLogs?.filter(log => log.status === 'clicked').length || 0;
      const unsubscribes = contacts?.filter(c => c.status === 'unsubscribed').length || 0;

      const openRate = emailsSent > 0 ? (emailsOpened / emailsSent) * 100 : 0;
      const clickRate = emailsSent > 0 ? (emailsClicked / emailsSent) * 100 : 0;
      const unsubscribeRate = emailsSent > 0 ? (unsubscribes / emailsSent) * 100 : 0;

      // Calculate monthly limit (1000 emails per month)
      const emailsRemaining = Math.max(0, 1000 - emailsSent);

      setStats({
        totalCampaigns,
        activeCampaigns,
        totalContacts,
        emailsSent,
        emailsRemaining,
        openRate,
        clickRate,
        unsubscribeRate,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    trend,
    color = "primary"
  }: {
    title: string;
    value: string | number;
    description: string;
    icon: any;
    trend?: string;
    color?: string;
  }) => (
    <Card className="relative overflow-hidden border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`w-4 h-4 text-${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className="w-3 h-3 text-success mr-1" />
            <span className="text-xs text-success">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your cold email campaigns and performance
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Campaigns"
          value={stats.totalCampaigns}
          description={`${stats.activeCampaigns} active campaigns`}
          icon={Mail}
          color="primary"
        />
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts.toLocaleString()}
          description="Across all campaigns"
          icon={Users}
          color="accent"
        />
        <StatCard
          title="Emails Sent"
          value={stats.emailsSent.toLocaleString()}
          description={`${stats.emailsRemaining} remaining this month`}
          icon={CheckCircle}
          color="success"
        />
        <StatCard
          title="Open Rate"
          value={`${stats.openRate.toFixed(1)}%`}
          description="Email engagement rate"
          icon={BarChart3}
          color="info"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Email Usage</CardTitle>
            <CardDescription>
              {stats.emailsSent} of 1,000 emails sent this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress 
              value={(stats.emailsSent / 1000) * 100} 
              className="h-3"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Used: {stats.emailsSent}</span>
              <span>Remaining: {stats.emailsRemaining}</span>
            </div>
          </CardContent>
        </Card>

        <StatCard
          title="Click Rate"
          value={`${stats.clickRate.toFixed(1)}%`}
          description="Clicks per email sent"
          icon={TrendingUp}
          color="primary"
        />

        <StatCard
          title="Unsubscribe Rate"
          value={`${stats.unsubscribeRate.toFixed(1)}%`}
          description="Unsubscribes per email sent"
          icon={XCircle}
          color="destructive"
        />
      </div>

      {/* Working Hours Info */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Email Sending Schedule
          </CardTitle>
          <CardDescription>
            Emails are sent automatically during US Eastern Time business hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Working Days</h4>
              <p className="text-sm text-muted-foreground mt-1">Monday - Friday</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Working Hours</h4>
              <p className="text-sm text-muted-foreground mt-1">8:00 AM - 6:00 PM ET</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Email Interval</h4>
              <p className="text-sm text-muted-foreground mt-1">13-27 minutes apart</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};