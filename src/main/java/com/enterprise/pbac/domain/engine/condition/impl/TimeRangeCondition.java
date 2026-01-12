package com.enterprise.pbac.domain.engine.condition.impl;

import com.enterprise.pbac.domain.engine.condition.Condition;
import com.enterprise.pbac.domain.engine.model.AuthorizationContext;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalTime;

/**
 * Condition that checks if the current time is within a specified range.
 * Useful for access control during business hours.
 */
@Data
@AllArgsConstructor
public class TimeRangeCondition implements Condition {
    private LocalTime startTime;
    private LocalTime endTime;
    
    @Override
    public boolean evaluate(AuthorizationContext context) {
        LocalTime currentTime = LocalTime.now();
        return currentTime.isAfter(startTime) && currentTime.isBefore(endTime);
    }
    
    @Override
    public String getDescription() {
        return String.format("Time range: %s - %s", startTime, endTime);
    }
}
