package com.tokenly.backend.security.rate;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private static class Counter {
        long count;
        Instant windowStart;
    }

    private final Map<String, Counter> store = new ConcurrentHashMap<>();

    public boolean allowRequest(String key, int limitPerMinute) {
        Instant now = Instant.now();

        Counter counter = store.computeIfAbsent(key, k -> {
            Counter c = new Counter();
            c.count = 0;
            c.windowStart = now;
            return c;
        });

        synchronized (counter) {
            if (now.isAfter(counter.windowStart.plusSeconds(60))) {
                counter.count = 0;
                counter.windowStart = now;
            }

            counter.count++;
            return counter.count <= limitPerMinute;
        }
    }
}
