#!/usr/bin/perl
# Local static server for testing dist-web (stand-in for scratch/serve.ps1, which this session may not run).
# perl serve.pl <root> <port>   -- localhost only, no-cache with Last-Modified/304, one request per connection.
use strict; use warnings;
use HTTP::Daemon; use HTTP::Status; use HTTP::Response; use HTTP::Date qw(time2str str2time);
my ($root, $port) = @ARGV; $port ||= 8767; $root =~ s{[\\/]+$}{};
my %types = (html=>'text/html; charset=utf-8', js=>'text/javascript; charset=utf-8', json=>'application/json',
  webp=>'image/webp', png=>'image/png', jpg=>'image/jpeg', svg=>'image/svg+xml', css=>'text/css',
  webmanifest=>'application/manifest+json', ico=>'image/x-icon', txt=>'text/plain; charset=utf-8');
my $d = HTTP::Daemon->new(LocalAddr => '127.0.0.1', LocalPort => $port, ReuseAddr => 1, Listen => 64) or die "listen: $!";
$| = 1; print "serving $root on http://localhost:$port/\n";
while (my $c = $d->accept) {
  $c->timeout(10);
  my $r = $c->get_request;
  if ($r) {
    my $p = $r->uri->path; $p =~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/ge;
    $p .= 'index.html' if $p =~ m{/$};
    if ($p =~ /\.\./) { $c->send_error(RC_FORBIDDEN); }
    else {
      my $f = $root . $p;
      if (-f $f) {
        my $mt = (stat($f))[9]; my $ims = $r->header('If-Modified-Since');
        if ($ims && str2time($ims) && str2time($ims) >= $mt) {
          my $res = HTTP::Response->new(304); $res->header('Cache-Control' => 'no-cache', 'Last-Modified' => time2str($mt), 'Connection' => 'close');
          $c->send_response($res);
        } elsif (open(my $fh, '<:raw', $f)) {
          local $/; my $body = <$fh>; close $fh;
          my ($ext) = $f =~ /\.([^.\/]+)$/; $ext = lc($ext // '');
          my $res = HTTP::Response->new(200);
          $res->header('Content-Type' => $types{$ext} // 'application/octet-stream', 'Cache-Control' => 'no-cache', 'Last-Modified' => time2str($mt), 'Connection' => 'close');
          $res->content($body);
          $c->send_response($res);
        } else { $c->send_error(RC_NOT_FOUND); }
      } else { $c->send_error(RC_NOT_FOUND); }
    }
  }
  $c->close; undef $c;
}
