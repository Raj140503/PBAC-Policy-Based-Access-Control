package com.enterprise.pbac.infrastructure.cache;

import com.enterprise.pbac.domain.entity.Policy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Redis-based caching service for policies to improve evaluation performance.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PolicyCacheService {
    
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String CACHE_KEY_PREFIX = "policies:";
    private static final long CACHE_TTL_MINUTES = 30;
    
    public void cacheApplicablePolicies(String resource, String action, List<Policy> policies) {
        String cacheKey = buildCacheKey(resource, action);
        
        try {
            redisTemplate.opsForValue().set(
                    cacheKey,
                    policies,
                    CACHE_TTL_MINUTES,
                    TimeUnit.MINUTES
            );
            log.debug("Policies cached for {}:{}", resource, action);
        } catch (Exception e) {
            log.warn("Failed to cache policies: {}", e.getMessage());
        }
    }
    
    @SuppressWarnings("unchecked")
    public List<Policy> getApplicablePolicies(String resource, String action) {
        String cacheKey = buildCacheKey(resource, action);
        
        try {
            return (List<Policy>) redisTemplate.opsForValue().get(cacheKey);
        } catch (Exception e) {
            log.warn("Failed to retrieve policies from cache: {}", e.getMessage());
            return null;
        }
    }
    
    public void invalidateApplicablePoliciesCache(String resource, String action) {
        String cacheKey = buildCacheKey(resource, action);
        
        try {
            redisTemplate.delete(cacheKey);
            log.debug("Policy cache invalidated for {}:{}", resource, action);
        } catch (Exception e) {
            log.warn("Failed to invalidate cache: {}", e.getMessage());
        }
    }
    
    public void invalidateAllCache() {
        try {
            redisTemplate.getConnectionFactory().getConnection().flushAll();
            log.info("All policy cache cleared");
        } catch (Exception e) {
            log.warn("Failed to clear all cache: {}", e.getMessage());
        }
    }
    
    private String buildCacheKey(String resource, String action) {
        return CACHE_KEY_PREFIX + resource + ":" + action;
    }
}
